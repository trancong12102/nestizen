import {
  ArgsType,
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
  SchemaIndexMap,
} from './types';
import { DMMF } from '@prisma/generator-helper';
import {
  buildSchemaIndex,
  getArgsTypeName,
  getTypeByIndexMap,
  isCountOutputType,
  removeRedundantTypesFromSchema,
  selectInputTypeRef,
} from './utils';
import { AGGREGATE_FIELDS } from './contanst';
import pascalcase from '@stdlib/string-pascalcase';

export class AST {
  public readonly schema: Schema;
  public readonly mappings: ModelMapping[];
  public readonly models: DMMF.Model[];
  public readonly schemaIndex: SchemaIndexMap;
  private readonly query: OutputType;
  private readonly mutation: OutputType;

  constructor(private readonly dmmf: DMMF.Document) {
    this.schema = this.buildSchema();
    this.query = this.schema.outputObjectTypes.find((t) => t.name === 'Query')!;
    this.mutation = this.schema.outputObjectTypes.find(
      (t) => t.name === 'Mutation',
    )!;
    this.schema.outputObjectTypes = this.schema.outputObjectTypes.filter(
      (t) => !['Query', 'Mutation'].includes(t.name),
    );
    this.mappings = this.buildModelMappings();
    this.schema = removeRedundantTypesFromSchema(this.schema, this.mappings);
    this.schemaIndex = buildSchemaIndex(this.schema);
    this.models = [...dmmf.datamodel.models];
  }

  getModel(name: string) {
    const model = this.models.find((m) => m.name === name);
    if (!model) {
      throw new Error(`Model not found: ${name}`);
    }

    return model;
  }

  getInputType(type: string) {
    return getTypeByIndexMap<InputType>(
      'inputObjectTypes',
      type,
      this.schema,
      this.schemaIndex,
    );
  }

  getOutputType(type: string) {
    return getTypeByIndexMap<OutputType>(
      'outputObjectTypes',
      type,
      this.schema,
      this.schemaIndex,
    );
  }

  getEnumType(type: string) {
    return getTypeByIndexMap<SchemaEnum>(
      'enumTypes',
      type,
      this.schema,
      this.schemaIndex,
    );
  }

  getArgsType(type: string) {
    return getTypeByIndexMap<ArgsType>(
      'argsTypes',
      type,
      this.schema,
      this.schemaIndex,
    );
  }

  private buildModelMappings(): ModelMapping[] {
    const { mappings } = this.dmmf;

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
          const schemaField = (
            type === 'Query' ? this.query : this.mutation
          ).fields.find((f) => f.name === v);
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

          const argsTypeName = getArgsTypeName(model, action);

          this.schema.argsTypes.push({
            name: argsTypeName,
            fields: schemaField.args,
          });

          return {
            name: v || '',
            type,
            action,
            argsTypeName,
            outputType: schemaField.outputType,
            isNullable: schemaField.isNullable || false,
          };
        });

      const findManyOperation = operations.find(
        (o) => o.action === ModelAction.findMany,
      );
      if (!findManyOperation) {
        throw new Error(`findMany operation not found for model: ${model}`);
      }

      const countArgsTypeName = `${model}CountArgs`;
      const findManyArgsType = this.schema.argsTypes.find(
        (t) => t.name === findManyOperation.argsTypeName,
      );
      if (!findManyArgsType) {
        throw new Error(`findManyArgsType not found for model: ${model}`);
      }
      const countArgsType: ArgsType = {
        name: countArgsTypeName,
        fields: findManyArgsType.fields,
      };
      this.schema.argsTypes.push(countArgsType);

      operations.push({
        name: `count${model}`,
        type: 'Query',
        action: ModelAction.count,
        argsTypeName: countArgsTypeName,
        outputType: {
          type: 'Int',
          isList: false,
          location: 'scalar',
        },
        isNullable: false,
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
      argsTypes: [],
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

    return (model || []).concat(prisma).map((t) => this.buildInputType(t));
  }

  private buildInputType(source: DMMF.InputType): InputType {
    const { name, constraints } = source;

    return {
      name,
      constraints: {
        maxNumFields: constraints.maxNumFields,
        minNumFields: constraints.minNumFields,
        fields: constraints.fields as string[] | undefined,
      },
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

    const model = isModel ? models.find((m) => m.name === name) : undefined;

    return {
      ...source,
      fields: source.fields
        .filter((f) => !isCountOutputType(f.outputType.type))
        .map((f) => this.buildSchemaField(f)),
      model,
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

    return [
      ...model.map((e) => this.buildModelEnumType(e, true)),
      ...prisma.map((e) => this.buildModelEnumType(e, false)),
    ];
  }

  private buildModelEnumType(
    source: DMMF.SchemaEnum,
    isModel: boolean,
  ): SchemaEnum {
    const { name, values } = source;
    const {
      datamodel: { enums },
    } = this.dmmf;

    const datemodelEnum = isModel
      ? enums.find((e) => e.name === name)
      : undefined;

    return {
      name,
      values: values as string[],
      model: datemodelEnum,
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
