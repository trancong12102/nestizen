import { WritableDMMF } from '../types';
import { getDocumentationFromLines, getDocumentationLines } from '../utils';

export const transpileDMMFAttributes = (dmmf: WritableDMMF) => {
  transpileHideFieldAttributes(dmmf);
};

const transpileHideFieldAttributes = (dmmf: WritableDMMF) => {
  const {
    datamodel: { models },
  } = dmmf;

  for (const model of models) {
    const { fields } = model;
    for (const field of fields) {
      const { documentation } = field;
      const lines = getDocumentationLines(documentation);
      field.documentation = getDocumentationFromLines(
        lines.map(replaceHideFieldAttributeInLine),
      );
    }
  }
};

const HIDE_FIELD_REGEX = /^(@graphql\.hideField)(\((.*?)\))?$/;
const HIDE_FIELD_TARGET_ATTRIBUTE = '@HideField';

const replaceHideFieldAttributeInLine = (line: string) => {
  const matches = line.match(HIDE_FIELD_REGEX);
  if (!matches) {
    return line;
  }

  const [, , , args] = matches;

  return `${HIDE_FIELD_TARGET_ATTRIBUTE}${args ? `({ ${args} })` : '()'}`;
};
