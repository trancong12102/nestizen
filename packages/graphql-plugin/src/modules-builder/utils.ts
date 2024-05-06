import kebabcase from '@stdlib/string-kebabcase';
import pascalcase from '@stdlib/string-pascalcase';

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

export const getPrismaArgsTypeName = (type: string) => `Prisma.${type}`;
