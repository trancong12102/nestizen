import kebabcase from '@stdlib/string-kebabcase';
import pascalcase from '@stdlib/string-pascalcase';
import path from 'node:path';
import { CodeBlockWriter } from 'ts-morph';
import { DMMF, ReadonlyDeep } from '@prisma/generator-helper';
import { ModelAction } from '../ast/types';

export const getResolverFunctionName = (model: string, action: ModelAction) =>
  `${action}${pascalcase(model)}`;
export const getModelModule = (model: string) => `${pascalcase(model)}Module`;
export const getModelModuleDirname = (model: string) => kebabcase(model);
export const getModelModuleFileName = (model: string) =>
  `${kebabcase(model)}.module.ts`;
export const getModelService = (model: string) => `${pascalcase(model)}Service`;
export const getModelServiceFileName = (model: string) =>
  `${kebabcase(model)}.service.ts`;
export const getModelBaseService = (model: string) =>
  `${pascalcase(model)}BaseService`;
export const getModelBaseServiceFileName = (model: string) =>
  `${kebabcase(model)}.base.service.ts`;
export const getModelResolver = (model: string) =>
  `${pascalcase(model)}Resolver`;
export const getModelResolverFileName = (model: string) =>
  `${kebabcase(model)}.resolver.ts`;
export const getModelBaseResolver = (model: string) =>
  `${pascalcase(model)}BaseResolver`;
export const getModelBaseResolverFileName = (model: string) =>
  `${kebabcase(model)}.base.resolver.ts`;
export const getModelBaseServicePath = (output: string, model: string) =>
  path.resolve(
    output,
    getModelModuleDirname(model),
    'base',
    getModelBaseServiceFileName(model),
  );
export const getModelBaseResolverPath = (output: string, model: string) =>
  path.resolve(
    output,
    getModelModuleDirname(model),
    'base',
    getModelBaseResolverFileName(model),
  );
export const getModelServicePath = (output: string, model: string) =>
  path.resolve(
    output,
    getModelModuleDirname(model),
    getModelServiceFileName(model),
  );
export const getModelResolverPath = (output: string, model: string) =>
  path.resolve(
    output,
    getModelModuleDirname(model),
    getModelResolverFileName(model),
  );
export const getModelModulePath = (output: string, model: string) =>
  path.resolve(
    output,
    getModelModuleDirname(model),
    getModelModuleFileName(model),
  );

export const ROOT_MODULE_NAME = 'NestizenModule';
export const ROOT_MODULE_FILENAME = 'nestizen.module.ts';
export const ROOT_MODULE_DIRNAME = 'nestizen';
export const getRootModulePath = (output: string) =>
  path.resolve(output, ROOT_MODULE_DIRNAME, ROOT_MODULE_FILENAME);

export const getPrismaNamespacedTypeName = (type: string) => `Prisma.${type}`;

export const getCompoundFieldName = (
  args: ReadonlyDeep<{
    name: string | null;
    fields: string[];
  }>,
) => {
  const { name, fields } = args;

  return name || fields.join('_');
};

export const writeResolveRelationWhereStatement = (
  writer: CodeBlockWriter,
  model: DMMF.Model,
) => {
  const { primaryKey, fields } = model;

  if (primaryKey) {
    const compoundField = getCompoundFieldName(primaryKey);

    writer
      .write(`${compoundField}: `)
      .inlineBlock(() => {
        for (const field of fields) {
          writer.writeLine(`${field.name}: parent.${field.name},`);
        }
      })
      .write(',');

    return;
  }

  const idField = fields.find((f) => f.isId);
  if (!idField) {
    throw new Error(`Cannot find id field ${model.name}`);
  }
  writer.writeLine(`${idField.name}: parent.${idField.name},`);
};

export const writeResolveRelationStatement = (
  writer: CodeBlockWriter,
  model: DMMF.Model,
  modelDelegateName: string,
  resolverFieldName: string,
  isList: boolean,
) => {
  writer
    .writeLine(`return this.prisma.client.${modelDelegateName}`)
    .indent(() => {
      writer
        .write('.findUniqueOrThrow(')
        .inlineBlock(() => {
          writer
            .write('where: ')
            .inlineBlock(() =>
              writeResolveRelationWhereStatement(writer, model),
            )
            .write(',');
        })
        .write(')')
        .writeLine(`.${resolverFieldName}(${isList ? 'args' : ''});`);
    });
};
