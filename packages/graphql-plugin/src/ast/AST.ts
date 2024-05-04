import {
  InputType,
  ModelAction,
  ModelMapping,
  ModelOperation,
  ModelQuery,
  OutputType,
  Schema,
  SchemaArg,
  SchemaEnum,
  SchemaField,
} from './types';
import { DMMF } from '@prisma/generator-helper';
import {
  getArgsTypeName,
  isCountOutputType,
  removeRedundantTypesFromSchema,
  selectInputTypeRef,
} from './utils';
import { AGGREGATE_FIELDS } from './contanst';
import pascalcase from '@stdlib/string-pascalcase';

export class AST {
  public readonly schema: Schema = {
    inputObjectTypes: [],
    enumTypes: [],
    outputObjectTypes: [],
  };
  public readonly mappings: ModelMapping[] = [];

  constructor(private readonly dmmf: DMMF.Document) {
    this.schema = this.buildSchema();
    this.mappings = this.buildModelMappings();
    this.schema.outputObjectTypes = this.schema.outputObjectTypes.filter(
      (t) => !['Query', 'Mutation'].includes(t.name),
    );
    this.schema = removeRedundantTypesFromSchema(this.schema, this.mappings);
  }

  private buildModelMappings(): ModelMapping[] {
    const { mappings } = this.dmmf;
    const query = this.schema.outputObjectTypes.find((t) => t.name === 'Query');
    if (!query) {
      throw new Error(`Query type not found`);
    }

    const mutation = this.schema.outputObjectTypes.find(
      (t) => t.name === 'Mutation',
    );
    if (!mutation) {
      throw new Error(`Mutation type not found`);
    }

    return mappings.modelOperations.map((m) => {
      const { model, ...operationsMap } = m;
      const dataModel = this.dmmf.datamodel.models.find(
        (m) => m.name === model,
      );
      if (!dataModel) {
        throw new Error(`Model not found: ${model}`);
      }

      const operations: ModelOperation[] = Object.entries(operationsMap)
        .filter(
          ([k, v]) =>
            Object.values(ModelAction).includes(k as ModelAction) && v,
        )
        .map(([k, v]) => {
          const action = k as ModelAction;
          const type = Object.values(ModelQuery).includes(k as ModelQuery)
            ? 'Query'
            : ('Mutation' as const);
          const schemaField = (type === 'Query' ? query : mutation).fields.find(
            (f) => f.name === v,
          );
          if (!schemaField) {
            throw new Error(`Schema field not found: ${v}`);
          }

          // Add aggregate operation args: _max, _min, _sum, _avg, _count
          if (action === ModelAction.aggregate) {
            schemaField.args.push(
              ...this.buildAggregateOperationArgs(dataModel),
            );
          }

          // Make take and skip required
          for (const arg of schemaField.args) {
            const {
              inputType: { type, location },
              name,
            } = arg;

            if (location !== 'scalar' || type !== 'Int') {
              continue;
            }

            if (name !== 'take' && name !== 'skip') {
              continue;
            }

            arg.isRequired = true;
            arg.isNullable = false;
          }

          return {
            name: v || '',
            type,
            action,
            schemaField,
            argsTypeName: getArgsTypeName(model, action),
          };
        });

      const findManyOperation = operations.find(
        (o) => o.action === ModelAction.findMany,
      );
      if (!findManyOperation) {
        throw new Error(`findMany operation not found for model: ${model}`);
      }

      operations.push({
        name: `count${model}`,
        type: 'Query',
        action: ModelAction.count,
        argsTypeName: findManyOperation.argsTypeName,
      });

      return {
        model,
        operations,
      };
    });
  }

  private buildAggregateOperationArgs(model: DMMF.Model): SchemaArg[] {
    return AGGREGATE_FIELDS.map((field) => {
      const fieldName = field.slice(1);

      const inputType: InputType = {
        name: `${model.name}${pascalcase(fieldName)}AggregateInputType`,
        constraints: {
          maxNumFields: null,
          minNumFields: null,
        },
        fields: model.fields
          .filter((f) => !f.relationName)
          .map((f) => ({
            name: f.name,
            inputType: {
              type: 'true',
              isList: false,
              location: 'scalar',
            },
            isNullable: true,
            isRequired: false,
          })),
      };

      this.schema.inputObjectTypes.push(inputType);

      return {
        name: field,
        isRequired: false,
        isNullable: true,
        inputType: {
          type: inputType.name,
          isList: false,
          location: 'inputObjectTypes',
        },
      };
    });
  }

  private buildSchema(): Schema {
    return {
      inputObjectTypes: this.buildInputObjectTypes(),
      outputObjectTypes: this.buildOutputObjectTypes(),
      enumTypes: this.buildEnumTypes(),
    };
  }

  private buildOutputObjectTypes(): Schema['outputObjectTypes'] {
    const {
      schema: {
        outputObjectTypes: { prisma, model = [] },
      },
    } = this.dmmf;

    return [
      ...prisma
        .filter((t) => !isCountOutputType(t.name))
        .map((t) => this.buildOutputType(t, false)),
      ...model.map((t) => this.buildOutputType(t, true)),
    ];
  }

  private buildInputObjectTypes(): Schema['inputObjectTypes'] {
    const {
      schema: {
        inputObjectTypes: { prisma, model },
      },
    } = this.dmmf;

    return prisma.concat(model || []).map((t) => this.buildInputType(t));
  }

  private buildInputType(source: DMMF.InputType): InputType {
    const { name, meta, constraints } = source;

    return {
      name,
      constraints: {
        maxNumFields: constraints.maxNumFields,
        minNumFields: constraints.minNumFields,
        fields: constraints.fields as string[] | undefined,
      },
      meta,
      fields: source.fields.map((f) => this.buildSchemaArg(f)),
    };
  }

  private buildOutputType(
    source: DMMF.OutputType,
    isModel: boolean,
  ): OutputType {
    const { name } = source;
    const {
      datamodel: { models },
    } = this.dmmf;

    return {
      ...source,
      fields: source.fields
        .filter((f) => !isCountOutputType(f.outputType.type))
        .map((f) => this.buildSchemaField(f)),
      model: isModel ? models.find((m) => m.name === name) : undefined,
    };
  }

  private buildSchemaField(source: DMMF.SchemaField): SchemaField {
    return {
      ...source,
      args: source.args.map((a) => this.buildSchemaArg(a)),
    };
  }

  private buildEnumTypes(): Schema['enumTypes'] {
    const {
      schema: {
        enumTypes: { prisma, model = [] },
      },
    } = this.dmmf;

    return [...model, ...prisma].map((t) => this.buildModelEnumType(t));
  }

  private buildModelEnumType(source: DMMF.SchemaEnum): SchemaEnum {
    const { name, values } = source;
    const {
      datamodel: { enums },
    } = this.dmmf;

    return {
      name,
      values: values as string[],
      model: enums.find((e) => e.name === name),
    };
  }

  private buildSchemaArg(source: DMMF.SchemaArg): SchemaArg {
    const { inputTypes, name, isNullable, isRequired, comment } = source;

    return {
      name,
      comment,
      isRequired,
      isNullable,
      inputType: selectInputTypeRef(inputTypes),
    };
  }
}
