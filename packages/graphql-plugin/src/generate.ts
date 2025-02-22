import { generateGraphqlResolvers } from './graphql-resolvers';
import { generateGraphqlTypes } from './graphql-types';
import { GenerateOptions, WritableDMMF } from './types';

export const generate = async (
  options: GenerateOptions,
  dmmf: WritableDMMF,
) => {
  await generateGraphqlTypes(dmmf, options);
  await generateGraphqlResolvers(dmmf, options);
};
