import { BaseModulesBuilder } from './base-modules-builder';
import { SourceFile } from '../types/ts-morph';
import { ModelMapping } from '../ast/types';
import {
  getModelBaseServicePath,
  getModelBaseService,
  getModelService,
  getModelServicePath,
} from './utils';
import { exists } from 'fs-extra';
import { ClassDeclarationStructure, Scope, StructureKind } from 'ts-morph';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getRelativeImportModuleSpecifier } from '../utils/import';

export class ServicesBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    const { mappings } = this.ast;

    const sourceFiles: SourceFile[] = [];

    for (const mapping of mappings) {
      const sourceFile = await this.buildServiceFile(mapping);
      if (sourceFile) {
        sourceFiles.push(sourceFile);
      }
    }

    return sourceFiles;
  }

  async buildServiceFile(
    mapping: ModelMapping,
  ): Promise<SourceFile | undefined> {
    const { output, prismaServiceName, prismaServicePath } =
      this.generateOptions;
    const { model } = mapping;
    const sourcePath = getModelServicePath(output, model);
    if (await exists(sourcePath)) {
      return;
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: getModelService(model),
      isExported: true,
      decorators: [
        {
          name: CommonImport.Injectable,
          arguments: [],
        },
      ],
      extends: getModelBaseService(model),
      ctors: [
        {
          parameters: [
            {
              isReadonly: true,
              scope: Scope.Protected,
              name: 'prisma',
              type: this.generateOptions.prismaServiceName,
            },
          ],
          statements: ['super(prisma);'],
        },
      ],
    };

    return {
      path: sourcePath,
      structure: {
        imports: [
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [getModelBaseService(model)],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              getModelBaseServicePath(output, model),
            ),
          },
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [CommonImport.Injectable],
            moduleSpecifier: CommonModuleSpecifier.NestCommon,
          },
          {
            kind: StructureKind.ImportDeclaration,
            namedImports: [prismaServiceName],
            moduleSpecifier: getRelativeImportModuleSpecifier(
              sourcePath,
              prismaServicePath,
            ),
          },
        ],
        statements: [classDeclaration],
      },
    };
  }
}
