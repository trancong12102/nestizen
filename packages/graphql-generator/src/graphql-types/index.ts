import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { readFile } from 'fs-extra';
import { generate } from 'prisma-nestjs-graphql/generate';
import { GENERATED_FILE_COMMENTS } from '../contants';
import { GenerateOptions, WritableDMMF } from '../types';
import { HIDE_FROM_CREATE_UPDATE_INPUT_ANNOTATIONS } from './constants';
import { transpileDMMFAttributes } from './transpile-DMMF-attributes';

export const generateGraphqlTypes = async (
  dmmf: WritableDMMF,
  options: GenerateOptions,
) => {
  const { graphqlTypesSourcePath, typesGenerateConfig, schemaPath } = options;

  transpileDMMFAttributes(dmmf);

  await generate({
    dmmf,
    generator: {
      name: 'prisma-nestjs-graphql',
      sourceFilePath: schemaPath,
      output: {
        value: graphqlTypesSourcePath,
        fromEnvVar: null,
      },
      provider: {
        value: 'prisma-nestjs-graphql',
        fromEnvVar: null,
      },
      binaryTargets: [],
      previewFeatures: [],
      config: {
        emitSingle: 'true',
        omitModelsCount: 'true',
        combineScalarFilters: 'true',
        noTypeId: 'true',
        noAtomicOperations: 'true',
        unsafeCompatibleWhereUniqueInput: 'true',
        graphqlScalars_BigInt_name: 'GraphQLBigInt',
        graphqlScalars_BigInt_specifier: 'graphql-scalars',
        decorate_hideInputFields_type:
          HIDE_FROM_CREATE_UPDATE_INPUT_ANNOTATIONS,
        decorate_hideInputFields_field: '@(createdAt|updatedAt|id)',
        decorate_hideInputFields_name: 'HideField',
        decorate_hideInputFields_from: '@nestjs/graphql',
        decorate_hideInputFields_arguments: '[]',
        decorate_hideNestedFields_type: '*Nested*Input',
        decorate_hideNestedFields_field:
          '@(upsert|set|updateMany|createMany|deleteMany)',
        decorate_hideNestedFields_name: 'HideField',
        decorate_hideNestedFields_from: '@nestjs/graphql',
        decorate_hideNestedFields_arguments: '[]',
        ...typesGenerateConfig,
      },
    },
    otherGenerators: [],
    schemaPath: '',
    datamodel: '',
    datasources: [],
    version: '1.0.0',
  });

  const outputFilePath = path.resolve(graphqlTypesSourcePath, 'index.ts');
  const content = await readFile(outputFilePath, 'utf-8');
  await writeFile(
    outputFilePath,
    `${GENERATED_FILE_COMMENTS}${content}`,
    'utf-8',
  );
};
