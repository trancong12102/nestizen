import {
  StatementStructures as TsMorphStatementStructures,
  WriterFunction,
  ImportDeclarationStructure as TsMorphImportDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
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

export type SourceFileStructure = {
  overwrite?: boolean;
  disableEslint?: boolean;
  imports: ImportDeclarationStructure[];
  statements: StatementStructure[];
};

export type SourceFile = {
  path: string;
  structure: SourceFileStructure;
};
