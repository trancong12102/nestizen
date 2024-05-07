import { BaseModulesBuilder } from './base-modules-builder';
import { SourceFile } from '../types/ts-morph';
import { ModelMapping } from '../ast/types';
import {
  getModelBaseResolverPath,
  getModelBaseServicePath,
  getModelBaseResolver,
  getModelBaseService,
  getModelResolver,
  getModelService,
  getModelResolverPath,
  getModelServicePath,
} from './utils';
import { exists } from 'fs-extra';
import { ClassDeclarationStructure, Scope, StructureKind } from 'ts-morph';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getRelativeImportModuleSpecifier } from '../utils/import';

export class ResolversBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    const { mappings } = this.ast;

    const sourceFiles: SourceFile[] = [];

    for (const mapping of mappings) {
      const sourceFile = await this.buildResolverFile(mapping);
      if (sourceFile) {
        sourceFiles.push(sourceFile);
      }
    }

    return sourceFiles;
  }

  async buildResolverFile(
    mapping: ModelMapping,
  ): Promise<SourceFile | undefined> {
    const { output } = this.generateOptions;
    const { model } = mapping;
    const sourcePath = getModelResolverPath(output, model);
    if (await exists(sourcePath)) {
      return;
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: getModelResolver(model),
      isExported: true,
      decorators: [
        {
          name: CommonImport.Resolver,
          arguments: [`() => ${model}`],
        },
      ],
      extends: getModelBaseResolver(model),
      ctors: [
        {
          parameters: [
            {
              isReadonly: true,
              scope: Scope.Protected,
              name: 'service',
              type: getModelService(model),
            },
          ],
          statements: ['super(service);'],
        },
      ],
    };

    return {
      path: sourcePath,
      structure: {
        imports: [
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [getModelBaseResolver(model)],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              getModelBaseResolverPath(output, model),
            ),
          },
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [CommonImport.Resolver],
            moduleSpecifier: CommonModuleSpecifier.NestGraphql,
          },
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
            namedImports: [model],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              this.typesOutputPath,
            ),
          },
        ],
        statements: [classDeclaration],
      },
    };
  }
}
