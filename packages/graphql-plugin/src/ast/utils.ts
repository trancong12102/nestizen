import pascalcase from '@stdlib/string-pascalcase';
import { InputTypeRef, ModelAction, ModelMapping, Schema } from './types';
import { DMMF } from '@prisma/generator-helper';

export const isCountOutputType = (type: string) =>
  type.endsWith('CountOutputType');

export const getArgsTypeName = (model: string, action: ModelAction): string =>
  `${model}${pascalcase(action)}Args`;

export const selectInputTypeRef = (
  refs: readonly DMMF.InputTypeRef[],
): InputTypeRef => {
  const refsWithoutFieldRefTypes: InputTypeRef[] = refs.filter(
    (i) => i.location !== 'fieldRefTypes',
  ) as InputTypeRef[];

  const rankedInputTypes = refsWithoutFieldRefTypes
    .filter(({ type }) => type)
    .map((i) => {
      let rank = 0;
      const { isList, location, type } = i;

      if (isList) {
        rank += 1;
      }

      if (location === 'scalar') {
        rank -= 3;
      }

      if (
        type === 'JsonNullValueInput' ||
        type === 'JsonNullValueFilter' ||
        type.match(/.+?Unchecked(Create|Update).+?Input$/) ||
        type === 'Null'
      ) {
        rank -= 10;
      }

      if (type.includes('RelationFilter')) {
        rank += 5;
      }

      return {
        ...i,
        rank,
      };
    })
    .sort((a, b) => b.rank - a.rank);

  const best = rankedInputTypes[0];
  if (!best) {
    throw new Error('Could not find best input type');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rank, ...result } = best;

  return result;
};

export const removeRedundantTypesFromSchema = (
  schema: Schema,
  mappings: ModelMapping[],
): Schema => {
  const schemaJson = JSON.stringify({
    schema,
    mappings,
  });

  const { enumTypes, inputObjectTypes, outputObjectTypes } = schema;

  return {
    enumTypes: cleanupTypesFromSchema(enumTypes, schemaJson),
    inputObjectTypes: cleanupTypesFromSchema(inputObjectTypes, schemaJson),
    outputObjectTypes: cleanupTypesFromSchema(outputObjectTypes, schemaJson),
  };
};

const cleanupTypesFromSchema = <T extends { name: string }[]>(
  types: T,
  schemaJson: string,
): T => types.filter((t) => getTypeIsReferenced(t.name, schemaJson)) as T;

const getTypeIsReferenced = (typeName: string, schemaJson: string): boolean => {
  const regex = new RegExp(`"${typeName}"`, 'g');
  const matches = schemaJson.match(regex);

  return matches ? matches.length > 1 : false;
};
