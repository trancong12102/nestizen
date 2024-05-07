export const getGraphqlListType = (type: string, isList: boolean): string =>
  isList ? `[${type}]` : type;

export const getTsListType = (type: string, isList: boolean): string =>
  isList ? `${type}[]` : type;

export const getTsNullableType = (type: string, isNullable: boolean): string =>
  isNullable ? `${type} | null` : type;

export const getTsType = (
  type: string,
  isList: boolean,
  isNullable: boolean | undefined,
) => getTsNullableType(getTsListType(type, isList), isNullable || false);
