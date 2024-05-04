export const importEsm = async <T>(
  moduleModifier: string,
  namedImport: string,
): Promise<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const module = await (eval(`import('${moduleModifier}')`) as Promise<
    Record<string, T>
  >);

  return module[namedImport];
};
