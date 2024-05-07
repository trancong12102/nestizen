import path from 'node:path';

export const NESTIZEN_MODULE = 'Nestizen';
export const NESTIZEN_MODULE_FILE = 'nestizen.module.ts';
export const NESTIZEN_MODULE_DIR = 'nestizen';
export const GRAPHQL_TYPES_FILE = 'graphql-types.ts';

export const getTypesOutputPath = (outputDir: string) =>
  path.resolve(outputDir, NESTIZEN_MODULE_DIR, GRAPHQL_TYPES_FILE);
