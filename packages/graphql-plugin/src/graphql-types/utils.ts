import { Model, ModelField, OutputType, WritableDMMF } from '../types';
import { DMMF } from '@prisma/generator-helper';

const outputTypeCache = new Map<string, OutputType>();

const QUERY_OUTPUT_TYPE_NAME = 'Query';
export const getQueryOutputType = (dmmf: WritableDMMF): OutputType =>
  getOutputTypeFromDMMF(dmmf, QUERY_OUTPUT_TYPE_NAME);

const MUTATION_OUTPUT_TYPE_NAME = 'Mutation';
export const getMutationOutputType = (dmmf: WritableDMMF): OutputType =>
  getOutputTypeFromDMMF(dmmf, MUTATION_OUTPUT_TYPE_NAME);

export type SchemaFieldWithResolverType = DMMF.SchemaField & {
  resolverType: 'Query' | 'Mutation';
};

const resolverSchemaFieldsCache = new Map<
  string,
  SchemaFieldWithResolverType
>();
let resolverSchemaFieldsCacheInitialized = false;
export const getResolverSchemaField = (
  dmmf: WritableDMMF,
  name: string,
): SchemaFieldWithResolverType => {
  buildResolverSchemaFieldsCache(dmmf);

  const field = resolverSchemaFieldsCache.get(name);
  if (!field) {
    throw new Error(`Field ${name} not found`);
  }

  return field;
};
const buildResolverSchemaFieldsCache = (dmmf: WritableDMMF) => {
  if (resolverSchemaFieldsCacheInitialized) {
    return;
  }

  const query = getQueryOutputType(dmmf);
  const mutation = getMutationOutputType(dmmf);

  const fields = [
    ...query.fields.map((f) => ({ ...f, resolverType: 'Query' as const })),
    ...mutation.fields.map((f) => ({
      ...f,
      resolverType: 'Mutation' as const,
    })),
  ];

  for (const field of fields) {
    resolverSchemaFieldsCache.set(field.name, field);
  }

  resolverSchemaFieldsCacheInitialized = true;
};

export const getOutputTypeFromDMMF = (dmmf: WritableDMMF, typeName: string) => {
  const {
    schema: {
      outputObjectTypes: { prisma, model },
    },
  } = dmmf;

  return (
    getOutputTypeFromList(prisma, typeName) ||
    getOutputTypeFromList(model, typeName)
  );
};

const getOutputTypeFromList = (
  types: OutputType[],
  typeName: string,
): OutputType => {
  const cachedType = outputTypeCache.get(typeName);
  if (cachedType) {
    return cachedType;
  }

  const type = types.find((t) => t.name === typeName);
  if (!type) {
    throw new Error(`Type ${typeName} not found`);
  }

  outputTypeCache.set(typeName, type);

  return type;
};

const modelTypeCache = new Map<string, Model>();
export const getModelTypeFromDMMF = (
  dmmf: WritableDMMF,
  modelName: string,
): Model => {
  const cachedModel = modelTypeCache.get(modelName);
  if (cachedModel) {
    return cachedModel;
  }

  const {
    datamodel: { models },
  } = dmmf;

  const model = models.find((m) => m.name === modelName);
  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }

  modelTypeCache.set(modelName, model);

  return model;
};

export const isRelationField = (field: ModelField) => field.relationName;
