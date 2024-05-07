import { BaseModulesBuilder } from './base-modules-builder';
import { SourceFile } from '../types/ts-morph';
import { emptyPromise } from '../utils/misc';
import { ClassDeclarationStructure, StructureKind } from 'ts-morph';
import {
  getModelModule,
  getModelModulePath,
  getRootModulePath,
  ROOT_MODULE_NAME,
} from './utils';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getRelativeImportModuleSpecifier } from '../utils/import';

export class RootModuleBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    await emptyPromise();

    const { output } = this.generateOptions;
    const sourcePath = getRootModulePath(output);
    const { mappings } = this.ast;

    const importedModules: string[] = mappings.map(({ model }) =>
      getModelModule(model),
    );

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: ROOT_MODULE_NAME,
      isExported: true,
      decorators: [
        {
          name: CommonImport.Module,
          arguments: [
            `
            {
              imports: [${importedModules.join(', ')}],
              exports: [${importedModules.join(', ')}],
            }
            `,
          ],
        },
      ],
    };

    return [
      {
        path: sourcePath,
        structure: {
          imports: [
            ...mappings.map(({ model }) => ({
              kind: StructureKind.ImportDeclaration as const,
              namedImports: [getModelModule(model)],
              moduleSpecifier: getRelativeImportModuleSpecifier(
                sourcePath,
                getModelModulePath(output, model),
              ),
            })),
            {
              kind: StructureKind.ImportDeclaration,
              namedImports: [CommonImport.Module],
              moduleSpecifier: CommonModuleSpecifier.NestCommon,
            },
          ],
          statements: [classDeclaration],
        },
        overwrite: true,
        disableEslint: true,
      },
    ];
  }
}
