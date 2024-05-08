import type { DMMF } from '@prisma/generator-helper';
import type { PluginOptions as ZenstackPluginOptions } from '@zenstackhq/sdk';
import type { Model } from '@zenstackhq/sdk/ast';
import { GenerateOptionsKeys, PluginOptionsSchema } from './options';
import { generate } from './generate';
import { getGraphqlTypesSourcePath, removeKeys } from './utils';
import { WritableDMMF } from './types';

export const name = 'GraphQL';

export default async function run(
  _model: Model,
  options: ZenstackPluginOptions,
  dmmf: DMMF.Document,
) {
  const pluginOptions = PluginOptionsSchema.passthrough().parse(options);

  const { output } = pluginOptions;

  await generate(
    {
      ...pluginOptions,
      graphqlTypesSourcePath: getGraphqlTypesSourcePath(output),
      typesGenerateConfig: removeKeys(
        pluginOptions,
        GenerateOptionsKeys,
      ) as Record<string, string>,
    },
    dmmf as WritableDMMF,
  );
}
