import * as path from 'node:path';
import { ZodSchema } from 'zod';

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
