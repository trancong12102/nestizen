const MATCH_REGEX = /^@@graphql\.hideOperations\(\[(.*?)]\)$/;

const AVAIL_OPERATIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ALL'] as const;

export type OperationsHideMap = Record<
  (typeof AVAIL_OPERATIONS)[number],
  boolean
>;

const GQL_OP_PREFIX = 'GQL_OP_';

export const getOperationsHideMap = (
  documentations?: string,
): OperationsHideMap => {
  const chunks = (documentations?.split('\n') || []).map((chunk) =>
    chunk.trim(),
  );
  const operations = Array.from(
    new Set(
      chunks
        .map((chunk) => {
          const match = chunk.match(MATCH_REGEX);
          if (match) {
            return match[1]
              .split(',')
              .map((operation) => operation.trim().replace(GQL_OP_PREFIX, ''));
          }
          return [];
        })
        .reduce((acc, curr) => [...acc, ...curr], []),
    ),
  ) as Array<keyof OperationsHideMap | 'ALL'>;

  if (operations.includes('ALL')) {
    return AVAIL_OPERATIONS.reduce(
      (acc, operation) => ({ ...acc, [operation]: true }),
      {} as OperationsHideMap,
    );
  }

  const result: OperationsHideMap = AVAIL_OPERATIONS.reduce(
    (acc, operation) => ({ ...acc, [operation]: false }),
    {} as OperationsHideMap,
  );

  operations.forEach((operation) => (result[operation] = true));

  return result;
};
