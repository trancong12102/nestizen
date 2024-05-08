const ATTRIBUTE = '@graphql.hideResolveField';

export const checkShouldHideResolveFunction = (
  documentations?: string,
): boolean => {
  return (
    documentations?.split('\n')?.some((line) => line.trim() === ATTRIBUTE) ||
    false
  );
};
