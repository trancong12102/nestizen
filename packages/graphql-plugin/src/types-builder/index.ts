import { AST } from '../ast/AST';
import { EnumTypesBuilder } from './enum-types-builder';
import { OutputTypesBuilder } from './output-types-builder';
import { optimizeImports } from '../utils/ts-morph';
import { InputTypesBuilder } from './input-types-builder';
import { ArgsTypesBuilder } from './args-types-builder';
import { SourceFileStructure } from '../types/ts-morph';

export const buildTypes = (ast: AST): SourceFileStructure => {
  const enumTypesBuilder = new EnumTypesBuilder(ast);
  const enumTypesOutput = enumTypesBuilder.build();

  const outputTypesBuilder = new OutputTypesBuilder(ast);
  const outputTypesOutput = outputTypesBuilder.build();

  const inputTypesBuilder = new InputTypesBuilder(ast);
  const inputTypesOutput = inputTypesBuilder.build();

  const argsTypesBuilder = new ArgsTypesBuilder(ast);
  const argsTypesOutput = argsTypesBuilder.build();

  return {
    imports: optimizeImports([
      ...enumTypesOutput.imports,
      ...outputTypesOutput.imports,
      ...inputTypesOutput.imports,
      ...argsTypesOutput.imports,
    ]),
    statements: [
      ...enumTypesOutput.statements,
      ...outputTypesOutput.statements,
      ...inputTypesOutput.statements,
      ...argsTypesOutput.statements,
    ],
  };
};
