import { BaseTypesBuilder } from './base-types-builder';
import {
  ImportDeclarationStructure,
  SourceFileStructure,
  StatementStructure,
} from '../types/ts-morph';
import { InputType } from '../ast/types';
import {
  type ClassDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  StructureKind,
} from 'ts-morph';

export class InputTypesBuilder extends BaseTypesBuilder {
  build(): SourceFileStructure {
    const {
      schema: { inputObjectTypes },
    } = this.ast;

    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['Field', 'InputType'],
        moduleSpecifier: '@nestjs/graphql',
      },
    ];
    const statements: StatementStructure[] = [];

    for (const inputObjectType of inputObjectTypes) {
      const { imports: inputImports, statements: inputStatements } =
        this.buildInputObjectType(inputObjectType);
      imports.push(...inputImports);
      statements.push(...inputStatements);
    }

    return { imports, statements };
  }

  private buildInputObjectType(type: InputType): SourceFileStructure {
    const { name, fields } = type;

    const properties: OptionalKind<PropertyDeclarationStructure>[] = [];
    const imports: ImportDeclarationStructure[] = [];

    for (const field of fields) {
      const { property, imports: schemaFieldImports } =
        this.buildSchemaArg(field);
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
          name: 'InputType',
          arguments: [],
        },
      ],
    };

    return {
      imports,
      statements: [classDeclaration],
    };
  }
}
