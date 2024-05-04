import { ImportDeclarationStructure } from '../types/ts-morph';
import { StructureKind } from 'ts-morph';

export const getDocsFromDoc = (doc?: string) => (doc ? [doc] : []);

export const optimizeImports = (
  imports: ImportDeclarationStructure[],
): ImportDeclarationStructure[] => {
  const moduleSpecifierGrouped: Record<string, string[]> = {};

  for (const { moduleSpecifier, namedImports } of imports) {
    if (!moduleSpecifierGrouped[moduleSpecifier]) {
      moduleSpecifierGrouped[moduleSpecifier] = [];
    }

    moduleSpecifierGrouped[moduleSpecifier].push(...namedImports);
  }

  for (const moduleSpecifier in moduleSpecifierGrouped) {
    moduleSpecifierGrouped[moduleSpecifier] = Array.from(
      new Set(moduleSpecifierGrouped[moduleSpecifier]),
    );
  }

  return Object.entries(moduleSpecifierGrouped).map(
    ([moduleSpecifier, namedImports]) => ({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier,
      namedImports,
    }),
  );
};
