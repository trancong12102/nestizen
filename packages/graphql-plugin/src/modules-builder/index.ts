import { AST } from '../ast/AST';
import { GenerateOptions } from '../generate-options';
import { BaseServicesBuilder } from './base-services-builder';
import { SourceFile } from '../types/ts-morph';
import { optimizeImports } from '../utils/ts-morph';
import { BaseResolversBuilder } from './base-resolvers-builder';
import { ServicesBuilder } from './services-builder';
import { ResolversBuilder } from './resolvers-builder';
import { ModulesBuilder } from './modules-builder';
import { RootModuleBuilder } from './root-module-builder';

export const buildModules = async (
  ast: AST,
  typesOutput: string,
  options: GenerateOptions,
): Promise<SourceFile[]> => {
  const baseServicesBuilder = new BaseServicesBuilder(
    ast,
    options,
    typesOutput,
  );
  const baseServices = await baseServicesBuilder.build();

  const baseResolversBuilder = new BaseResolversBuilder(
    ast,
    options,
    typesOutput,
  );
  const baseResolvers = await baseResolversBuilder.build();

  const servicesBuilder = new ServicesBuilder(ast, options, typesOutput);
  const services = await servicesBuilder.build();

  const resolversBuilder = new ResolversBuilder(ast, options, typesOutput);
  const resolvers = await resolversBuilder.build();

  const modulesBuilder = new ModulesBuilder(ast, options, typesOutput);
  const modules = await modulesBuilder.build();

  const rootModuleBuilder = new RootModuleBuilder(ast, options, typesOutput);
  const rootModules = await rootModuleBuilder.build();

  return [
    ...baseServices,
    ...baseResolvers,
    ...services,
    ...resolvers,
    ...modules,
    ...rootModules,
  ].map((sourceFile) => ({
    ...sourceFile,
    structure: {
      ...sourceFile.structure,
      imports: optimizeImports([...sourceFile.structure.imports]),
    },
  }));
};
