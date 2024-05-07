import { AST } from '../ast/AST';
import { SchemaArg } from '../ast/types';
import {
  ClassPropertyStructure,
  ImportDeclarationStructure,
  SourceFileStructure,
} from '../types/ts-morph';
import { getScalarType } from './scalar-type';
import { StructureKind } from 'ts-morph';
import { getGraphqlListType, getTsListType } from './utils';
import { getDocsFromDoc } from '../utils/ts-morph';

export class BaseTypesBuilder {
  constructor(protected readonly ast: AST) {}

  build(): SourceFileStructure {
    throw new Error('Not implemented');
  }

  protected buildSchemaArg(
    field: SchemaArg,
    unsafeCompatibleWhereUniqueInput?: boolean,
  ): ClassPropertyStructure {
    const { name, isRequired, inputType, comment } = field;
    const { type, isList } = inputType;

    const imports: ImportDeclarationStructure[] = [];

    const scalar = getScalarType(type);
    const graphqlType = scalar ? scalar.graphqlType : type;
    const tsType = scalar ? scalar.tsType : type;

    if (scalar) {
      imports.push(...scalar.imports);
    }

    return {
      imports,
      property: {
        kind: StructureKind.Property,
        name,
        type: getTsListType(tsType, isList),
        docs: getDocsFromDoc(comment),
        hasQuestionToken: !unsafeCompatibleWhereUniqueInput && !isRequired,
        decorators: [
          {
            name: 'Field',
            arguments: [
              `() => ${getGraphqlListType(graphqlType, isList)}, ${JSON.stringify(
                {
                  description: comment,
                  nullable: !isRequired,
                },
              )}`,
            ],
          },
        ],
      },
    };
  }
}
