import type { DMMF } from '@prisma/generator-helper';
import type { PluginOptions } from '@zenstackhq/sdk';
import type { Model } from '@zenstackhq/sdk/ast';
import { GenerateOptionsSchema } from './generate-options';
import { generate } from './generate';

export const name = 'GraphQL';

export default async function run(
  _model: Model,
  options: PluginOptions,
  dmmf: DMMF.Document,
) {
  const generateOptions = GenerateOptionsSchema.parse(options);

  await generate(generateOptions, dmmf);
}
