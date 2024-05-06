import { BaseTypesBuilder } from './base-types-builder';
import {
  ImportDeclarationStructure,
  SourceFileStructure,
  StatementStructure,
} from '../types/ts-morph';
import { ArgsType } from '../ast/types';
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

export class ArgsTypesBuilder extends BaseTypesBuilder {
  build(): SourceFileStructure {
    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [CommonImport.ArgsType],
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
      },
    ];
    const statements: StatementStructure[] = [];

    const {
      schema: { argsTypes },
    } = this.ast;
    for (const argsType of argsTypes) {
      const { statements: argsTypeStatements, imports: argsTypeImports } =
        this.buildArgsType(argsType);
      statements.push(...argsTypeStatements);
      imports.push(...argsTypeImports);
    }

    return { imports, statements };
  }

  private buildArgsType(type: ArgsType): SourceFileStructure {
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
          name: CommonImport.ArgsType,
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
