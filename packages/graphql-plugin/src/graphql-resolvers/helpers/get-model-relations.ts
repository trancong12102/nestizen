import { DMMF, ReadonlyDeep } from '@prisma/generator-helper';

export const getModelRelations = (model: ReadonlyDeep<DMMF.Model>) =>
  model.fields.filter((field) => field.relationName);
