import { BaseTypesBuilder } from './base-types-builder';
import { BuildTypeOutput } from './types';
import {
  ImportDeclarationStructure,
  StatementStructure,
} from '../types/ts-morph';
import { SchemaField } from '../ast/types';
import {
  ClassDeclarationStructure,
  OptionalKind,
  PropertyDeclarationStructure,
  StructureKind,
} from 'ts-morph';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getDocsFromDoc } from '../utils/ts-morph';

export class ArgsTypesBuilder extends BaseTypesBuilder {
  build(): BuildTypeOutput {
    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [CommonImport.ArgsType],
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
      },
    ];
    const statements: StatementStructure[] = [];

    const { mappings } = this.ast;
    for (const mapping of mappings) {
      const { operations } = mapping;

      for (const operation of operations) {
        const { argsTypeName, schemaField } = operation;
        if (!schemaField) {
          continue;
        }

        const { statements: fieldStatements, imports: fieldImports } =
          this.buildSchemaFieldArgsType(argsTypeName, schemaField);
        statements.push(...fieldStatements);
        imports.push(...fieldImports);
      }
    }

    return { imports, statements };
  }

  private buildSchemaFieldArgsType(
    name: string,
    field: SchemaField,
  ): BuildTypeOutput {
    const { documentation, args } = field;

    const properties: OptionalKind<PropertyDeclarationStructure>[] = [];
    const imports: ImportDeclarationStructure[] = [];

    for (const arg of args) {
      const { property, imports: schemaFieldImports } =
        this.buildSchemaArg(arg);
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
          name: CommonImport.ArgsType,
          arguments: [],
        },
      ],
      docs: getDocsFromDoc(documentation),
    };

    return {
      imports,
      statements: [classDeclaration],
    };
  }
}
