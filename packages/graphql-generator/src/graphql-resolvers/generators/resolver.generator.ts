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

export class ResolverGenerator {
  constructor(
    private readonly project: ProjectStructure,
    private readonly model: DMMF.Model,
    private readonly options: GenerateOptions,
  ) {}

  async generate() {
    const modelName = getModelNameVariants(this.model.name);
    const { output, graphqlTypesSourcePath } = this.options;
    const sourcePath = path.resolve(
      output,
      modelName.kebab,
      `${modelName.kebab}.resolver.ts`,
    );

    if (await isPathExists(sourcePath)) {
      return;
    }

    const typesImportModuleModifier = getRelativeImportModuleSpecifier(
      sourcePath,
      graphqlTypesSourcePath,
    );

    const sourceFile: SourceFileStructure = {
      kind: StructureKind.SourceFile,
    };

    const imports: ImportDeclarationStructure[] = [];

    const ServiceType = `${modelName.original}Service`;

    imports.push(
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Resolver')],
        moduleSpecifier: t('@nestjs/graphql'),
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [ServiceType],
        moduleSpecifier: `./${modelName.kebab}.service`,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [`${modelName.original}ResolverBase`],
        moduleSpecifier: `./base/${modelName.kebab}.resolver.base`,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [modelName.original],
        moduleSpecifier: typesImportModuleModifier,
      },
    );

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: `${modelName.original}Resolver`,
      decorators: [
        {
          name: t('Resolver'),
          arguments: [`() => ${modelName.original}`],
        },
      ],
      ctors: [
        {
          parameters: [
            {
              name: t('service'),
              type: ServiceType,
              scope: Scope.Public,
              isReadonly: true,
            },
          ],
          statements: ['super(service);'],
        },
      ],
      isExported: true,
      extends: `${modelName.original}ResolverBase`,
    };

    sourceFile.statements = [...optimizeImports(imports), classDeclaration];

    this.project.setSourceFile(sourcePath, sourceFile);
  }
}
