import { AST } from '../ast/AST';
import { SourceFileStructure, StructureKind } from 'ts-morph';
import { EnumTypesBuilder } from './enum-types-builder';
import { OutputTypesBuilder } from './output-types-builder';
import { optimizeImports } from '../utils/ts-morph';
import {
  ESLINT_DISABLE_COMMENT,
  GENERATED_WARNING_COMMENT,
} from '../contants/comments';
import { InputTypesBuilder } from './input-types-builder';
import { ArgsTypesBuilder } from './args-types-builder';

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
    kind: StructureKind.SourceFile,
    statements: [
      GENERATED_WARNING_COMMENT,
      ESLINT_DISABLE_COMMENT,
      ...optimizeImports([
        ...enumTypesOutput.imports,
        ...outputTypesOutput.imports,
        ...inputTypesOutput.imports,
        ...argsTypesOutput.imports,
      ]),
      ...enumTypesOutput.statements,
      ...outputTypesOutput.statements,
      ...inputTypesOutput.statements,
      ...argsTypesOutput.statements,
    ],
  };
};
