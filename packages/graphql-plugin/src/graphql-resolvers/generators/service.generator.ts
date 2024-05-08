import {
  ClassDeclarationStructure,
  ImportDeclarationStructure,
  Scope,
  SourceFileStructure,
  StructureKind,
} from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { getModelNameVariants } from '../helpers/get-model-name-variants';
import path from 'path';
import { t } from '../helpers/keyword';
import { ProjectStructure } from '../helpers/project-structure';
import { isPathExists } from '../helpers/is-path-exists';
import { optimizeImports } from '../helpers/optimize-imports';
import { getRelativeImportModuleSpecifier } from '../helpers/get-relative-import-module-modifier';
import { GenerateOptions } from '../../types';

export class ServiceGenerator {
  constructor(
    private readonly project: ProjectStructure,
    private readonly model: DMMF.Model,
    private readonly options: GenerateOptions,
  ) {}

  async generate() {
    const modelName = getModelNameVariants(this.model.name);
    const { prismaServicePath, output } = this.options;
    const sourcePath = path.resolve(
      output,
      modelName.kebab,
      `${modelName.kebab}.service.ts`,
    );

    if (await isPathExists(sourcePath)) {
      return;
    }

    const prismaServiceImportModuleModifier = getRelativeImportModuleSpecifier(
      sourcePath,
      prismaServicePath,
    );

    const sourceFile: SourceFileStructure = {
      kind: StructureKind.SourceFile,
    };

    const imports: ImportDeclarationStructure[] = [];

    imports.push(
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Injectable')],
        moduleSpecifier: t('@nestjs/common'),
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: t('PrismaService'),
        moduleSpecifier: prismaServiceImportModuleModifier,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [`${modelName.original}ServiceBase`],
        moduleSpecifier: `./base/${modelName.kebab}.service.base`,
      },
    );

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: `${modelName.original}Service`,
      decorators: [
        {
          name: t('Injectable'),
          arguments: [],
        },
      ],
      ctors: [
        {
          parameters: [
            {
              name: t('prisma'),
              type: t('PrismaService'),
              scope: Scope.Public,
              isReadonly: true,
            },
          ],
          statements: ['super(prisma);'],
        },
      ],
      isExported: true,
      extends: `${modelName.original}ServiceBase`,
    };

    sourceFile.statements = [...optimizeImports(imports), classDeclaration];

    this.project.setSourceFile(sourcePath, sourceFile);
  }
}
