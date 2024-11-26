import { DMMF } from '@prisma/generator-helper';
import { WritableDeep } from 'type-fest';
import { PluginOptions } from './options';

export type WritableDMMF = WritableDeep<DMMF.Document>;
export type OutputType =
  WritableDMMF['schema']['outputObjectTypes']['prisma'][number];
export type SchemaField = OutputType['fields'][number];
export type InputType =
  WritableDMMF['schema']['inputObjectTypes']['prisma'][number];
export type SchemaArg = InputType['fields'][number];
export type Model = WritableDMMF['datamodel']['models'][number];
export type ModelField = Model['fields'][number];

export type GenerateOptions = PluginOptions & {
  graphqlTypesSourcePath: string;
  typesGenerateConfig: Record<string, string>;
};
