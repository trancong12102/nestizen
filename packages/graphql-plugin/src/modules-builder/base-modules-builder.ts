import { AST } from '../ast/AST';
import { SourceFile } from '../types/ts-morph';
import { GenerateOptions } from '../generate-options';

export class BaseModulesBuilder {
  constructor(
    protected readonly ast: AST,
    protected readonly generateOptions: GenerateOptions,
    protected readonly typesOutputPath: string,
  ) {}

  async build(): Promise<SourceFile[]> {
    await new Promise((resolve) => {
      resolve(true);
    });
    throw new Error('Method not implemented');
  }
}
