import { ImportDeclarationStructure } from '../types/ts-morph';

export type GraphqlScalar = {
  imports: ImportDeclarationStructure[];
  graphqlType: string;
  tsType: string;
};
