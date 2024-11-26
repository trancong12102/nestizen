import { readFile } from 'node:fs/promises';
import type { DMMF } from '@prisma/generator-helper';
import type { PluginOptions as ZenstackPluginOptions } from '@zenstackhq/sdk';
import type { Model } from '@zenstackhq/sdk/ast';
import { remove } from 'fs-extra';
import { generate } from './generate';
import {
  GenerateOptionsKeys,
  PluginOptionsSchema,
  SchemaInfoSchema,
} from './options';
import { WritableDMMF } from './types';
import {
  getGraphqlTypesSourcePath,
  mergeDocumentationFromVerboseDMMF,
  removeKeys,
} from './utils';

export const name = 'GraphQL';

const SCHEMA_INFO_FILE = 'nestizen-schema.json';

export default async function run(
  _model: Model,
  options: ZenstackPluginOptions,
  dmmf: DMMF.Document,
) {
  const { sourceFilePath, dmmf: verboseDMMF } = SchemaInfoSchema.parse(
    await JSON.parse(await readFile(SCHEMA_INFO_FILE, 'utf-8')),
  );

  const pluginOptions = PluginOptionsSchema.passthrough().parse({
    ...options,
    schemaPath: sourceFilePath,
  });

  const { output } = pluginOptions;

  const mergedDMMF = mergeDocumentationFromVerboseDMMF(
    dmmf as WritableDMMF,
    verboseDMMF as DMMF.Document,
  );

  await remove(SCHEMA_INFO_FILE);

  await generate(
    {
      ...pluginOptions,
      graphqlTypesSourcePath: getGraphqlTypesSourcePath(output),
      typesGenerateConfig: removeKeys(
        pluginOptions,
        GenerateOptionsKeys,
      ) as Record<string, string>,
    },
    mergedDMMF,
  );
}
