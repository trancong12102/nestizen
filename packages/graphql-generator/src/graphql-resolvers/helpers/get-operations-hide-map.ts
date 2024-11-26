import { CrudMethod } from '../types/crud-method';

const MATCH_REGEX = /^@@graphql\.hideOperations\(\[(.*?)]\)$/;

const AVAIL_OPERATIONS = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ALL'] as const;

type Operation = (typeof AVAIL_OPERATIONS)[number];

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

const crudHideMap: Record<CrudMethod, Operation> = {
  count: 'READ',
  findUnique: 'READ',
  findMany: 'READ',
  aggregate: 'READ',
  create: 'CREATE',
  delete: 'DELETE',
  update: 'UPDATE',
};

export type CrudHideMap = Record<CrudMethod, Operation>;

export const getCrudOperationHideMap = (
  operationHideMap: OperationsHideMap,
): CrudHideMap => {
  return (Object.keys(crudHideMap) as CrudMethod[]).reduce(
    (acc, method) => ({
      ...acc,
      [method]: operationHideMap[crudHideMap[method]],
    }),
    {} as CrudHideMap,
  );
};
