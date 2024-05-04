import {
  ImportDeclarationStructure,
  StatementStructure,
} from '../types/ts-morph';

export type BuildTypeOutput = {
  imports: ImportDeclarationStructure[];
  statements: StatementStructure[];
};

export type GraphqlScalar = {
  imports: ImportDeclarationStructure[];
  graphqlType: string;
  tsType: string;
};
