import { DMMF } from '@prisma/generator-helper';
import { AGGREGATE_FIELDS } from './contanst';

export type Schema = {
  inputObjectTypes: InputType[];
  outputObjectTypes: OutputType[];
  enumTypes: SchemaEnum[];
};

export type SchemaEnum = {
  name: string;
  values: string[];
  model?: DMMF.DatamodelEnum;
};

export type OutputType = {
  name: string;
  fields: SchemaField[];
  model?: DMMF.Model;
};

export type SchemaField = {
  name: string;
  isNullable?: boolean;
  outputType: OutputTypeRef;
  args: SchemaArg[];
  documentation?: string;
};

type OutputTypeRef = TypeRef<'scalar' | 'outputObjectTypes' | 'enumTypes'>;

export type InputType = {
  name: string;
  constraints: {
    maxNumFields: number | null;
    minNumFields: number | null;
    fields?: string[];
  };
  meta?: {
    source?: string;
  };
  fields: SchemaArg[];
};

export type SchemaArg = {
  name: string;
  comment?: string;
  isNullable: boolean;
  isRequired: boolean;
  inputType: InputTypeRef; // select only one inputType from prisma dmmf inputTypes
};

export type InputTypeRef = TypeRef<'scalar' | 'inputObjectTypes' | 'enumTypes'>;
type TypeRef<AllowedLocations extends FieldLocation> = {
  isList: boolean;
  type: string;
  location: AllowedLocations;
};
type FieldLocation =
  | 'scalar'
  | 'inputObjectTypes'
  | 'outputObjectTypes'
  | 'enumTypes';

export type ModelMapping = {
  model: string;
  operations: ModelOperation[];
};

export type ModelOperation = {
  name: string;
  type: 'Mutation' | 'Query';
  action: ModelAction;
  schemaField?: SchemaField;
  argsTypeName: string;
};

export enum ModelQuery {
  findUnique = 'findUnique',
  findFirst = 'findFirst',
  findMany = 'findMany',
  groupBy = 'groupBy',
  count = 'count',
  aggregate = 'aggregate',
}

export enum ModelMutation {
  create = 'create',
  createMany = 'createMany',
  update = 'update',
  updateMany = 'updateMany',
  upsert = 'upsert',
  delete = 'delete',
  deleteMany = 'deleteMany',
}

export const ModelAction = {
  ...ModelQuery,
  ...ModelMutation,
} as const;

export type ModelAction = (typeof ModelAction)[keyof typeof ModelAction];

export type AggregateType = (typeof AGGREGATE_FIELDS)[number];
