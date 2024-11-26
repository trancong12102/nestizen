import { dirname, relative } from 'node:path';

export function getRelativeImportModuleSpecifier(
  importDest: string,
  targetPath: string,
) {
  if (!/^(\.\/|\.\.\/|\/).+/.test(targetPath)) {
    return targetPath;
  }

  const targetPathWithoutExtension = targetPath.replace(/\.ts$/, '');

  const relativePath = relative(dirname(importDest), targetPathWithoutExtension)
    .replace(/\.ts$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '.');

  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
}
