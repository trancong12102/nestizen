import { GraphqlScalar } from './types';
import { StructureKind } from 'ts-morph';
import { CommonModuleSpecifier } from '../contants/common-imports';

const SCALAR_TYPES = [
  'Int',
  'String',
  'DateTime',
  'Boolean',
  'true',
  'Json',
  'Float',
  'Bytes',
  'BigInt',
  'Decimal',
] as const;
type ScalarType = (typeof SCALAR_TYPES)[number];

const SCALAR_TYPE_MAP: Record<ScalarType, GraphqlScalar> = {
  Int: {
    tsType: 'number',
    graphqlType: 'Int',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['Int'],
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
      },
    ],
  },
  String: {
    tsType: 'string',
    graphqlType: 'String',
    imports: [],
  },
  DateTime: {
    tsType: 'Date',
    graphqlType: 'Date',
    imports: [],
  },
  Boolean: {
    tsType: 'boolean',
    graphqlType: 'Boolean',
    imports: [],
  },
  true: {
    tsType: 'boolean',
    graphqlType: 'Boolean',
    imports: [],
  },
  Json: {
    tsType: 'any',
    graphqlType: 'GraphQLJSON',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['GraphQLJSON'],
        moduleSpecifier: CommonModuleSpecifier.GraphqlScalars,
      },
    ],
  },
  Float: {
    tsType: 'number',
    graphqlType: 'Float',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['Float'],
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
      },
    ],
  },
  Bytes: {
    tsType: 'Buffer',
    graphqlType: 'GraphQLByte',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['GraphQLByte'],
        moduleSpecifier: CommonModuleSpecifier.GraphqlScalars,
      },
    ],
  },
  BigInt: {
    tsType: 'bigint',
    graphqlType: 'GraphQLBigInt',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['GraphQLBigInt'],
        moduleSpecifier: CommonModuleSpecifier.GraphqlScalars,
      },
    ],
  },
  Decimal: {
    tsType: 'string',
    graphqlType: 'GraphQLHexadecimal',
    imports: [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: ['GraphQLHexadecimal'],
        moduleSpecifier: CommonModuleSpecifier.GraphqlScalars,
      },
    ],
  },
};

export const getScalarType = (type: string): GraphqlScalar => {
  return SCALAR_TYPE_MAP[type as ScalarType];
};
