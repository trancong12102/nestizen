import { BaseModulesBuilder } from './base-modules-builder';
import { SourceFile } from '../types/ts-morph';
import {
  getModelModule,
  getModelModulePath,
  getModelResolver,
  getModelResolverPath,
  getModelService,
  getModelServicePath,
} from './utils';
import { ClassDeclarationStructure, StructureKind } from 'ts-morph';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getRelativeImportModuleSpecifier } from '../utils/import';
import { exists } from 'fs-extra';

export class ModulesBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    const { mappings } = this.ast;
    const sourceFiles: SourceFile[] = [];

    for (const mapping of mappings) {
      const srcFile = await this.buildModuleFile(mapping.model);
      if (srcFile) {
        sourceFiles.push(srcFile);
      }
    }

    return sourceFiles;
  }

  async buildModuleFile(model: string): Promise<SourceFile | undefined> {
    const { output } = this.generateOptions;
    const sourcePath = getModelModulePath(output, model);
    if (await exists(sourcePath)) {
      return;
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: getModelModule(model),
      isExported: true,
      decorators: [
        {
          name: CommonImport.Module,
          arguments: [
            `{
  providers: [${getModelService(model)}, ${getModelResolver(model)}],
  exports: [${getModelService(model)}],
          }`,
          ],
        },
      ],
    };

    return {
      path: sourcePath,
      structure: {
        imports: [
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [getModelService(model)],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              getModelServicePath(output, model),
            ),
          },
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [getModelResolver(model)],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              getModelResolverPath(output, model),
            ),
          },
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [CommonImport.Module],
            moduleSpecifier: CommonModuleSpecifier.NestCommon,
          },
        ],
        statements: [classDeclaration],
      },
    };
  }
}
