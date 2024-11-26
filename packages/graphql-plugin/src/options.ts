import { z } from 'zod';
import { getZodSchemaFieldsShallow } from './utils';

export const PluginOptionsSchema = z.object({
  output: z.string(),
  prismaServicePath: z.string(),
  prismaServiceName: z.string(),
  schemaPath: z.string(),
});

export type PluginOptions = z.infer<typeof PluginOptionsSchema>;

export const GenerateOptionsKeys = getZodSchemaFieldsShallow(
  PluginOptionsSchema,
).concat(['provider', 'schemaPath']);

export const SchemaInfoSchema = z.object({
  dmmf: z.object({}).passthrough(),
  sourceFilePath: z.string(),
});
