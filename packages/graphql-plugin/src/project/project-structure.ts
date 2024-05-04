import {
  Project,
  SourceFileStructure as TsMorphSourceFileStructure,
  StructureKind,
} from 'ts-morph';
import { SourceFileStructure } from '../types/ts-morph';
import {
  ESLINT_DISABLE_COMMENT,
  GENERATED_WARNING_COMMENT,
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

  setSourceFile(path: string, structure: SourceFileStructure) {
    this._projectStructure[path] = {
      kind: StructureKind.SourceFile,
      statements: [
        GENERATED_WARNING_COMMENT,
        ESLINT_DISABLE_COMMENT,
        ...structure.imports,
        ...structure.statements,
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
