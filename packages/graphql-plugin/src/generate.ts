import type { GenerateOptions } from './generate-options';
import type { DMMF } from '@prisma/generator-helper';
import { writeFile } from 'fs/promises';
import { AST } from './ast/AST';
import { getTypesOutputPath } from './utils/module-path';
import { buildTypes } from './types-builder';
import { ProjectStructure } from './project/project-structure';
import { buildModules } from './modules-builder';

export const generate = async (
  options: GenerateOptions,
  dmmf: DMMF.Document,
) => {
  const { output } = options;
  const ast = new AST(dmmf);
  await writeFile('schema.json', JSON.stringify(ast.schema, null, 2));
  await writeFile('mappings.json', JSON.stringify(ast.mappings, null, 2));
  await writeFile('dmmf.json', JSON.stringify(dmmf, null, 2));

  const projectStructure = new ProjectStructure();

  const typesOutputPath = getTypesOutputPath(output);
  const typesSourceFile = buildTypes(ast);
  projectStructure.addSourceFile({
    path: typesOutputPath,
    structure: typesSourceFile,
    disableEslint: true,
    overwrite: true,
  });

  const modules = await buildModules(ast, typesOutputPath, options);
  projectStructure.addSourceFiles(modules);

  await projectStructure.save();
};
