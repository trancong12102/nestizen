export const getGraphqlTypeList = (type: string, isList: boolean): string =>
  isList ? `[${type}]` : type;
