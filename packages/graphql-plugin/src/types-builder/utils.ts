export const getGraphqlListType = (type: string, isList: boolean): string =>
  isList ? `[${type}]` : type;

export const getTsListType = (type: string, isList: boolean): string =>
  isList ? `${type}[]` : type;
