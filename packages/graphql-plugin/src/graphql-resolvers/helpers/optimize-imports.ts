import { ImportDeclarationStructure, StructureKind } from 'ts-morph';

export function optimizeImports(
  imports: ImportDeclarationStructure[],
): ImportDeclarationStructure[] {
  const importMap = new Map<
    string,
    {
      isTypeOnly?: boolean;
      namedImports: Set<string>;
    }
  >();

  for (const importDeclaration of imports) {
    const key = importDeclaration.moduleSpecifier;
    if (!importMap.has(key)) {
      importMap.set(key, {
        isTypeOnly: importDeclaration.isTypeOnly,
        namedImports: new Set(),
      });
    }

    const existingImport = importMap.get(key);
    if (!existingImport) {
      throw new Error('existingImport is undefined');
    }

    const namedImports = (importDeclaration.namedImports || []) as string[];
    if (!namedImports.map) {
      throw new Error('namedImports is not an array');
    }

    for (const namedImport of namedImports) {
      if (typeof namedImport !== 'string') {
        throw new Error('namedImport is not a string');
      }

      existingImport.namedImports.add(namedImport);
    }
  }

  return Array.from(importMap.entries()).map(
    ([moduleSpecifier, { isTypeOnly, namedImports }]) => ({
      kind: StructureKind.ImportDeclaration,
      moduleSpecifier,
      namedImports: Array.from(namedImports),
      isTypeOnly,
    }),
  );
}
