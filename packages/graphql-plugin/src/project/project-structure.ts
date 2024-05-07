import {
  Project,
  SourceFileStructure as TsMorphSourceFileStructure,
  StructureKind,
} from 'ts-morph';
import { SourceFile } from '../types/ts-morph';
import {
  ESLINT_DISABLE_COMMENT,
  OVERWRITE_WARNING_COMMENT,
} from '../contants/comments';

export class ProjectStructure {
  private readonly _projectStructure: Record<
    string,
    TsMorphSourceFileStructure
  > = {};
  private readonly project: Project;

  constructor() {
    this.project = new Project();
  }

  addSourceFiles(sourceFiles: SourceFile[]) {
    for (const sourceFile of sourceFiles) {
      this.addSourceFile(sourceFile);
    }
  }

  addSourceFile({
    path,
    structure: { imports, statements },
    overwrite,
    disableEslint,
  }: SourceFile) {
    this._projectStructure[path] = {
      kind: StructureKind.SourceFile,
      statements: [
        ...(overwrite ? [OVERWRITE_WARNING_COMMENT] : []),
        ...(disableEslint ? [ESLINT_DISABLE_COMMENT] : []),
        ...imports,
        ...statements,
      ],
    };
  }

  async save() {
    for (const [filePath, structure] of Object.entries(
      this._projectStructure,
    )) {
      this.project.createSourceFile(filePath, structure, {
        overwrite: true,
      });
    }
    await this.project.save();
  }
}
