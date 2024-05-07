import {
  StatementStructures as TsMorphStatementStructures,
  WriterFunction,
  ImportDeclarationStructure as TsMorphImportDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  MethodDeclarationStructure,
} from 'ts-morph';

export type ImportDeclarationStructure = Pick<
  TsMorphImportDeclarationStructure,
  'kind'
> & {
  namedImports: string[];
  moduleSpecifier: string;
};

export type StatementStructure =
  | string
  | WriterFunction
  | TsMorphStatementStructures;

export type ClassPropertyStructure = {
  imports: ImportDeclarationStructure[];
  property: OptionalKind<PropertyDeclarationStructure>;
};

export type ClassMethodStructure = {
  imports: ImportDeclarationStructure[];
  method: OptionalKind<MethodDeclarationStructure>;
};

export type SourceFileStructure = {
  imports: ImportDeclarationStructure[];
  statements: StatementStructure[];
};

export type SourceFile = {
  path: string;
  structure: SourceFileStructure;
  overwrite?: boolean;
  disableEslint?: boolean;
};
