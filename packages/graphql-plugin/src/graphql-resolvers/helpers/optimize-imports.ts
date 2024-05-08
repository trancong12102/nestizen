import { ImportDeclarationStructure, StructureKind } from 'ts-morph';

export function optimizeImports(
  imports: ImportDeclarationStructure[],
): ImportDeclarationStructure[] {
  const namedImportsMap: Record<string, string[]> = {};
  const namespaceImportsMap: Record<string, string> = {};
  const defaultImportsMap: Record<string, string> = {};

  for (const importDeclaration of imports) {
    const { moduleSpecifier } = importDeclaration;

    if (importDeclaration.namedImports) {
      namedImportsMap[moduleSpecifier] = (
        namedImportsMap[moduleSpecifier] || []
      ).concat(importDeclaration.namedImports as string[]);
    }

    if (importDeclaration.namespaceImport) {
      namespaceImportsMap[moduleSpecifier] = importDeclaration.namespaceImport;
    }

    if (importDeclaration.defaultImport) {
      defaultImportsMap[moduleSpecifier] = importDeclaration.defaultImport;
    }
  }

  return Object.entries(namedImportsMap)
    .map<ImportDeclarationStructure>(([moduleSpecifier, namedImports]) => ({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier,
      namedImports: Array.from(new Set(namedImports)),
    }))
    .concat(
      Object.entries(namespaceImportsMap).map<ImportDeclarationStructure>(
        ([moduleSpecifier, namespaceImport]) => ({
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier,
          namespaceImport,
        }),
      ),
    )
    .concat(
      Object.entries(defaultImportsMap).map<ImportDeclarationStructure>(
        ([moduleSpecifier, defaultImport]) => ({
          kind: StructureKind.ImportDeclaration,
          moduleSpecifier,
          defaultImport,
        }),
      ),
    );
}
