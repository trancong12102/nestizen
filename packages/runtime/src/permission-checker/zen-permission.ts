import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import camelcase from '@stdlib/string-camelcase';
import { PolicyCrudKind } from '@zenstackhq/runtime';

export const ZenPermission = (model: string, operation: PolicyCrudKind) =>
  SetMetadata<string, ZenPermissionCheck>(METADATA_KEY, {
    model,
    operation,
  });

type ZenPermissionCheck = {
  model: string;
  operation: PolicyCrudKind;
};

const METADATA_KEY = 'zen:permission';

const getZenPermissionCheck = (
  reflector: Reflector,
  context: ExecutionContext,
) => reflector.get<ZenPermissionCheck>(METADATA_KEY, context.getHandler());

export async function checkZenPermission(
  client: unknown,
  reflector: Reflector,
  context: ExecutionContext,
): Promise<boolean> {
  const check = getZenPermissionCheck(reflector, context);
  if (!check) {
    return true;
  }

  const { model, operation } = check;
  const delegate = (client as Record<string, unknown>)[camelcase(model)] as {
    check: (args: { operation: PolicyCrudKind }) => Promise<boolean>;
  };
  if (!delegate || !delegate.check) {
    throw new Error(
      `ZenPermissionCheck: ${model} does not have a check method.`,
    );
  }

  return await delegate.check({ operation });
}
