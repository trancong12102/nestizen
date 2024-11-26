import { generatorHandler } from '@prisma/generator-helper';
import { GenerateOptionsKeys, PluginOptionsSchema } from './options';
import { generate } from './generate';
import { getGraphqlTypesSourcePath, removeKeys } from './utils';
import { WritableDMMF } from './types';

generatorHandler({
  onManifest() {
    return {
      prettyName: 'Nestizen Prisma Generator',
    }
  },
  async onGenerate(options) {
    const {dmmf, generator: {config, output, sourceFilePath}} = options

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
})
