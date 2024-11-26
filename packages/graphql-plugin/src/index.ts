import type { DMMF } from '@prisma/generator-helper';
import type { PluginOptions as ZenstackPluginOptions } from '@zenstackhq/sdk';
import type { Model } from '@zenstackhq/sdk/ast';

export const name = 'GraphQL';

export default async function run(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _model: Model,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: ZenstackPluginOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _dmmf: DMMF.Document,
) {}
