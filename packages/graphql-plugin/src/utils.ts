import * as path from 'node:path';
import { DMMF } from '@prisma/generator-helper';
import { ZodSchema } from 'zod';
import { WritableDMMF } from './types';

export const getDocumentationLines = (
  documentation: string | null | undefined,
) => documentation?.split('\n').map((l) => l.trim()) ?? [];

export const getDocumentationFromLines = (lines: string[]) => lines.join('\n');

export const ROOT_MODULE_NAME = 'NestizenModule';
export const ROOT_MODULE_FILE_NAME = 'nestizen.module.ts';
const ROOT_MODULE_DIR = 'nestizen';

const GRAPHQL_TYPES_OUTPUT_DIR = 'graphql-types';

export const getGraphqlTypesSourcePath = (output: string) =>
  path.resolve(output, ROOT_MODULE_DIR, GRAPHQL_TYPES_OUTPUT_DIR);

export const getRootModuleSourcePath = (output: string) =>
  path.resolve(output, ROOT_MODULE_DIR, ROOT_MODULE_FILE_NAME);

export const removeKeys = <T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
) => {
  const copy = { ...obj };
  keys.forEach((key) => delete copy[key]);
  return copy;
};

export const getZodSchemaFieldsShallow = (schema: ZodSchema) => {
  const fields: Record<string, true> = {};
  const proxy = new Proxy(fields, {
    get(_, key) {
      if (key === 'then' || typeof key !== 'string') {
        return;
      }
      fields[key] = true;
    },
  });
  schema.safeParse(proxy);
  return Object.keys(fields);
};

export const mergeDocumentationFromVerboseDMMF = (
  dmmf: WritableDMMF,
  verboseDMMF: DMMF.Document,
) => {
  const {
    datamodel: { models },
  } = dmmf;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const verboseModel = verboseDMMF.datamodel.models[i];
    model.documentation = verboseModel.documentation;

    // Merge fields
    const { fields } = model;
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const verboseField = verboseModel.fields[j];
      field.documentation = verboseField.documentation;
    }
  }

  return dmmf;
};
