import { BaseModulesBuilder } from './base-modules-builder';
import { ClassMethodStructure, SourceFile } from '../types/ts-morph';
import { ModelMapping, ModelOperation } from '../ast/types';
import * as path from 'node:path';
import {
  getModelBaseServiceFileName,
  getModelModuleDirname,
  getPrismaArgsTypeName,
} from './utils';
import { getScalarType } from '../types-builder/scalar-type';
import { StructureKind } from 'ts-morph';
import { getTsListType } from '../types-builder/utils';

export class BaseServicesBuilder extends BaseModulesBuilder {
  // eslint-disable-next-line @typescript-eslint/require-await
  // async build(): Promise<SourceFile[]> {
  //   const { mappings } = this.ast;
  //
  //   return [];
  // }
  //
  // buildServiceFile(mapping: ModelMapping): SourceFile {
  //   const { model, operations } = mapping;
  //   const { output } = this.generateOptions;
  //   const sourcePath = path.resolve(
  //     output,
  //     getModelModuleDirname(model),
  //     getModelBaseServiceFileName(model),
  //   );
  // }
  //
  // buildOperation(operation: ModelOperation): ClassMethodStructure {
  //   const {
  //     argsTypeName,
  //     action,
  //     outputType: { type, isList },
  //   } = operation;
  //
  //   const scalar = getScalarType(type);
  //   const tsType = scalar ? scalar.tsType : type;
  //   const imports = scalar ? scalar.imports : [];
  //
  //   return {
  //     imports,
  //     method: {
  //       kind: StructureKind.Method,
  //       name: action,
  //       isAsync: true,
  //       parameters: [
  //         {
  //           kind: StructureKind.Parameter,
  //           name: 'args',
  //           type: getPrismaArgsTypeName(argsTypeName),
  //         },
  //       ],
  //       returnType: getTsListType(tsType, isList),
  //       statements: [],
  //     },
  //   };
  // }
}
