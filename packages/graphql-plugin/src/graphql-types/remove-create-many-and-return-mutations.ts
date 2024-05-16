import { WritableDMMF } from '../types';

// TODO: remove after issue https://github.com/unlight/prisma-nestjs-graphql/issues/214 is resolved
export const removeCreateManyAndReturnMutations = (dmmf: WritableDMMF) => {
  const mutation = dmmf.schema.outputObjectTypes.prisma[1];
  if (!mutation) {
    throw new Error('Mutation type not found');
  }

  const { fields } = mutation;
  mutation.fields = fields.filter(
    ({ name }) =>
      !(name.startsWith('createMany') && name.endsWith('AndReturn')),
  );

  const {
    schema: { outputObjectTypes },
  } = dmmf;
  const { model } = outputObjectTypes;

  outputObjectTypes.model = model.filter(
    ({ name }) =>
      !(name.startsWith('CreateMany') && name.endsWith('AndReturnOutputType')),
  );
};
