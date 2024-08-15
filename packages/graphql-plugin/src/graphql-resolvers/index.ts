import { BaseServiceGenerator } from './generators/base-service.generator';
import { BaseResolverGenerator } from './generators/base-resolver.generator';
import { ServiceGenerator } from './generators/service.generator';
import { ResolverGenerator } from './generators/resolver.generator';
import { ModuleGenerator } from './generators/module.generator';
import { RootModuleGenerator } from './generators/root-module.generator';
import { ProjectStructure } from './helpers/project-structure';
import { getCrudOperationHideMap, getOperationsHideMap } from './helpers/get-operations-hide-map';
import { GenerateOptions, WritableDMMF } from '../types';

export const generateGraphqlResolvers = async (
  dmmf: WritableDMMF,
  options: GenerateOptions,
) => {
  const project = new ProjectStructure();

  for (const model of dmmf.datamodel.models) {
    const operationsHideMap = getOperationsHideMap(model.documentation);

    const baseServiceGenerator = new BaseServiceGenerator(
      project,
      model,
      options,
      getCrudOperationHideMap(operationsHideMap)
    );
    baseServiceGenerator.generate();

    const baseResolverGenerator = new BaseResolverGenerator(
      project,
      model,
      options,
      operationsHideMap,
    );
    baseResolverGenerator.generate();

    const serviceGenerator = new ServiceGenerator(project, model, options);
    await serviceGenerator.generate();

    const resolverGenerator = new ResolverGenerator(project, model, options);
    await resolverGenerator.generate();

    const moduleGenerator = new ModuleGenerator(project, model, options);
    await moduleGenerator.generate();
  }

  const crudModuleGenerator = new RootModuleGenerator(project, dmmf, options);
  crudModuleGenerator.generate();

  await project.save();
};
