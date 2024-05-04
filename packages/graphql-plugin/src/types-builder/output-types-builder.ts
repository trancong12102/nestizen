import { BaseTypesBuilder } from './base-types-builder';
import {
  type ClassDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  StructureKind,
} from 'ts-morph';
import { OutputType, SchemaField } from '../ast/types';
import { BuildTypeOutput } from './types';
import {
  ClassPropertyStructure,
  ImportDeclarationStructure,
  StatementStructure,
} from '../types/ts-morph';
import { getScalarType } from './scalar-type';
import { getGraphqlListType, getTsListType } from './utils';
import { getDocsFromDoc } from '../utils/ts-morph';

export class OutputTypesBuilder extends BaseTypesBuilder {
  build(): BuildTypeOutput {
    const {
      schema: { outputObjectTypes },
    } = this.ast;

    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['Field', 'ObjectType'],
        moduleSpecifier: '@nestjs/graphql',
      },
    ];
    const statements: StatementStructure[] = [];

    for (const outputObjectType of outputObjectTypes) {
      const { imports: outputImports, statements: outputStatements } =
        this.buildOutputObjectType(outputObjectType);
      imports.push(...outputImports);
      statements.push(...outputStatements);
    }

    return { imports, statements };
  }

  private buildOutputObjectType(type: OutputType): BuildTypeOutput {
    const { name, fields, model } = type;
    const { documentation } = model || {};
    const properties: OptionalKind<PropertyDeclarationStructure>[] = [];
    const imports: ImportDeclarationStructure[] = [];

    for (const field of fields) {
      const { property, imports: schemaFieldImports } =
        this.buildSchemaFieldOutputType(field);
      properties.push(property);
      imports.push(...schemaFieldImports);
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name,
      isExported: true,
      properties,
      decorators: [
        {
          name: 'ObjectType',
          arguments: [
            JSON.stringify({
              description: documentation,
            }),
          ],
        },
      ],
    };

    return {
      imports,
      statements: [classDeclaration],
    };
  }

  private buildSchemaFieldOutputType(
    field: SchemaField,
  ): ClassPropertyStructure {
    const {
      name,
      documentation,
      isNullable,
      outputType: { type, isList },
    } = field;

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
        docs: getDocsFromDoc(documentation),
        hasQuestionToken: isNullable,
        decorators: [
          {
            name: 'Field',
            arguments: [
              `() => ${getGraphqlListType(graphqlType, isList)}, ${JSON.stringify(
                {
                  description: documentation,
                  nullable: isNullable,
                },
              )}`,
            ],
          },
        ],
      },
    };
  }
}