import { DMMF } from '@prisma/generator-helper';
import {
  ClassDeclarationStructure,
  ImportDeclarationStructure,
  SourceFileStructure,
  StructureKind,
} from 'ts-morph';
import { GENERATED_FILE_COMMENTS } from '../../contants';
import { GenerateOptions } from '../../types';
import { ROOT_MODULE_NAME, getRootModuleSourcePath } from '../../utils';
import { getModelNameVariants } from '../helpers/get-model-name-variants';
import { t } from '../helpers/keyword';
import { optimizeImports } from '../helpers/optimize-imports';
import { ProjectStructure } from '../helpers/project-structure';

export class RootModuleGenerator {
  constructor(
    private readonly project: ProjectStructure,
    private readonly dmmf: DMMF.Document,
    private readonly options: GenerateOptions,
  ) {}

  generate() {
    const { output } = this.options;
    const sourcePath = getRootModuleSourcePath(output);

    const sourceFile: SourceFileStructure = {
      kind: StructureKind.SourceFile,
    };

    const imports: ImportDeclarationStructure[] = [];

    const models = this.dmmf.datamodel.models;

    for (const model of models) {
      const modelName = getModelNameVariants(model.name);

      const Module = `${modelName.original}Module`;

      imports.push({
        kind: StructureKind.ImportDeclaration,
        namedImports: [Module],
        moduleSpecifier: `../${modelName.kebab}/${modelName.kebab}.module`,
      });
    }

    imports.push({
      kind: StructureKind.ImportDeclaration,
      namedImports: [t('Module')],
      moduleSpecifier: t('@nestjs/common'),
    });

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: ROOT_MODULE_NAME,
      isExported: true,
      decorators: [
        {
          name: t('Module'),
          arguments: [
            (writer) => {
              writer.block(() => {
                writer.writeLine(
                  `imports: [${models
                    .map((m) => `${m.name}Module`)
                    .join(', ')}],`,
                );
              });
            },
          ],
        },
      ],
    };

    sourceFile.statements = [
      GENERATED_FILE_COMMENTS,
      ...optimizeImports(imports),
      classDeclaration,
    ];

    this.project.setSourceFile(sourcePath, sourceFile);
  }
}
