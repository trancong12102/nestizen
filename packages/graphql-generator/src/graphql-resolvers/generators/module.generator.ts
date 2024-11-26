import {
  ClassDeclarationStructure,
  ImportDeclarationStructure,
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
import { GenerateOptions } from '../../types';

export class ModuleGenerator {
  constructor(
    private readonly project: ProjectStructure,
    private readonly model: DMMF.Model,
    private readonly options: GenerateOptions,
  ) {}

  async generate() {
    const modelName = getModelNameVariants(this.model.name);
    const { output } = this.options;
    const sourcePath = path.resolve(
      output,
      modelName.kebab,
      `${modelName.kebab}.module.ts`,
    );

    if (await isPathExists(sourcePath)) {
      return;
    }

    const sourceFile: SourceFileStructure = {
      kind: StructureKind.SourceFile,
    };

    const imports: ImportDeclarationStructure[] = [];

    const ServiceType = `${modelName.original}Service`;
    const ResolverType = `${modelName.original}Resolver`;

    imports.push(
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Module')],
        moduleSpecifier: t('@nestjs/common'),
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [ServiceType],
        moduleSpecifier: `./${modelName.kebab}.service`,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [ResolverType],
        moduleSpecifier: `./${modelName.kebab}.resolver`,
      },
    );

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: `${modelName.original}Module`,
      decorators: [
        {
          name: t('Module'),
          arguments: [
            (writer) => {
              writer.block(() => {
                writer.writeLine(
                  `providers: [${ServiceType}, ${ResolverType}]`,
                );
              });
            },
          ],
        },
      ],
      isExported: true,
    };

    sourceFile.statements = [...optimizeImports(imports), classDeclaration];

    this.project.setSourceFile(sourcePath, sourceFile);
  }
}
