import { generatorHandler } from '@prisma/generator-helper';
import { generate } from './generate';
import { GenerateOptionsKeys, PluginOptionsSchema } from './options';
import { WritableDMMF } from './types';
import { getGraphqlTypesSourcePath, removeKeys } from './utils';

generatorHandler({
  onManifest() {
    return {
      prettyName: 'Nestizen Prisma Generator',
    };
  },
  async onGenerate(options) {
    const {
      dmmf,
      generator: { config, output, sourceFilePath },
    } = options;

    const pluginOptions = PluginOptionsSchema.passthrough().parse({
      ...config,
      output: output?.value,
      schemaPath: sourceFilePath,
    });

    await generate(
      {
        ...pluginOptions,
        graphqlTypesSourcePath: getGraphqlTypesSourcePath(pluginOptions.output),
        typesGenerateConfig: removeKeys(
          pluginOptions,
          GenerateOptionsKeys,
        ) as Record<string, string>,
      },
      dmmf as WritableDMMF,
    );
  },
});
