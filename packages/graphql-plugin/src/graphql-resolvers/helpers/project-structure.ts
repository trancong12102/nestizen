import { Project, SourceFileStructure, StructureKind } from 'ts-morph';

export class ProjectStructure {
  private readonly _projectStructure: Record<string, SourceFileStructure> = {};
  private readonly project: Project;

  constructor() {
    this.project = new Project();
  }

  getSourceFile(path: string) {
    return this._projectStructure[path];
  }

  isSourceFileExists(path: string) {
    return !!this.getSourceFile(path);
  }

  setSourceFile(path: string, structure: SourceFileStructure) {
    this._projectStructure[path] = structure;
  }

  createSourceFile(path: string, structure?: SourceFileStructure) {
    this._projectStructure[path] = structure || {
      kind: StructureKind.SourceFile,
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
