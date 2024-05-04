import { BaseTypesBuilder } from './base-types-builder';
import { EnumDeclarationStructure, StructureKind } from 'ts-morph';
import { SchemaEnum } from '../ast/types';
import { DMMF } from '@prisma/generator-helper';
import { getDocsFromDoc } from '../utils/ts-morph';
import {
  ImportDeclarationStructure,
  SourceFileStructure,
  StatementStructure,
} from '../types/ts-morph';

export class EnumTypesBuilder extends BaseTypesBuilder {
  build(): SourceFileStructure {
    const {
      schema: { enumTypes },
    } = this.ast;

    const statements: StatementStructure[] = [];
    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['registerEnumType'],
        moduleSpecifier: '@nestjs/graphql',
      },
    ];

    for (const enumType of enumTypes) {
      const { name, values } = enumType;
      const { documentation, valuesMap } =
        this.buildEnumDocumentations(enumType);

      const enumDeclaration: EnumDeclarationStructure = {
        kind: StructureKind.Enum,
        name,
        isExported: true,
        docs: documentation ? [documentation] : undefined,
        members: values.map((value) => ({
          name: value,
          value,
          docs: getDocsFromDoc(valuesMap[value]?.description),
        })),
      };

      statements.push(
        enumDeclaration,
        `registerEnumType(${name}, ${JSON.stringify({
          name,
          description: documentation,
          valuesMap,
        })})`,
      );
    }

    return { imports, statements };
  }

  private buildEnumDocumentations(type: SchemaEnum): {
    documentation?: string;
    valuesMap: Record<string, { description?: string }>;
  } {
    const { model } = type;
    if (!model) {
      return { documentation: undefined, valuesMap: {} };
    }

    const { documentation, values } = model;

    return {
      documentation,
      valuesMap: (
        values as Array<DMMF.EnumValue & { documentation?: string }>
      ).reduce(
        (acc, { name, documentation }) => ({
          ...acc,
          [name]: {
            description: documentation,
          },
        }),
        {},
      ),
    };
  }
}
