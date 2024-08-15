import {
  ClassDeclarationStructure,
  ImportDeclarationStructure,
  MethodDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
  Scope,
  SourceFileStructure,
  StructureKind,
} from 'ts-morph';
import { DMMF } from '@prisma/generator-helper';
import { getModelNameVariants } from '../helpers/get-model-name-variants';
import path from 'path';
import { t } from '../helpers/keyword';
import camelcase from '@stdlib/string-camelcase';
import pascalcase from '@stdlib/string-pascalcase';
import { ProjectStructure } from '../helpers/project-structure';
import { optimizeImports } from '../helpers/optimize-imports';
import { CrudMethod } from '../types/crud-method';
import { ModelNameVariants } from '../types/model-name-variants';
import { getRelativeImportModuleSpecifier } from '../helpers/get-relative-import-module-modifier';
import { GENERATED_FILE_COMMENTS } from '../../contants';
import { GenerateOptions } from '../../types';
import { CRUD_METHODS } from '../contansts/CRUD_METHODS';
import { CrudHideMap } from '../helpers/get-operations-hide-map';

export class BaseServiceGenerator {
  private readonly modelName: ModelNameVariants;
  private sourceFile: SourceFileStructure;
  private imports: ImportDeclarationStructure[] = [];
  private classDeclaration: ClassDeclarationStructure;
  private classMethods: MethodDeclarationStructure[] = [];
  private prismaServiceImportModuleModifier: string;

  constructor(
    private readonly project: ProjectStructure,
    private readonly model: DMMF.Model,
    private readonly options: GenerateOptions,
    private readonly hideMap: CrudHideMap,
  ) {
    this.modelName = getModelNameVariants(model.name);
  }

  private get resolveParentWhere() {
    const { primaryKey, fields } = this.model;

    if (primaryKey) {
      const { fields } = primaryKey;
      const compoundField = fields.join('_');
      let where = `{ ${compoundField}: { `;

      for (const field of fields) {
        where += `${field}: parent.${field}, `;
      }
      where += `}}`;

      return where;
    }

    const idField = fields.find((f) => f.isId);
    if (!idField) {
      throw new Error(`Cannot find id field ${this.model.name}`);
    }

    return `{ ${idField.name}: parent.${idField.name}, }`;
  }

  generate() {
    const { prismaServicePath, output } = this.options;

    const sourcePath = path.resolve(
      output,
      this.modelName.kebab,
      'base',
      `${this.modelName.kebab}.service.base.ts`,
    );

    this.sourceFile = {
      kind: StructureKind.SourceFile,
    };

    this.prismaServiceImportModuleModifier = getRelativeImportModuleSpecifier(
      sourcePath,
      prismaServicePath,
    );

    this.imports.push(
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Prisma')],
        moduleSpecifier: t('@zenstackhq/runtime/models'),
        isTypeOnly: true,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('PrismaService')],
        moduleSpecifier: this.prismaServiceImportModuleModifier,
      },
    );

    this.declareClass();
    this.declareCrudMethods();
    this.declareResolveMethods();

    this.classDeclaration.methods = this.classMethods;
    this.sourceFile.statements = [
      GENERATED_FILE_COMMENTS,
      ...optimizeImports(this.imports),
      this.classDeclaration,
    ];

    this.project.setSourceFile(sourcePath, this.sourceFile);
  }

  private declareResolveMethods() {
    const { fields } = this.model;

    const relations = fields.filter(({ relationName }) => relationName);
    if (relations.length === 0) {
      return;
    }

    this.imports.push({
      kind: StructureKind.ImportDeclaration,
      namedImports: [this.modelName.original],
      moduleSpecifier: t('@zenstackhq/runtime/models'),
      isTypeOnly: true,
    });

    for (const relation of relations) {
      const { name, type, isList } = relation;

      const parameters: OptionalKind<ParameterDeclarationStructure>[] = [
        {
          name: t('parent'),
          type: this.modelName.original,
        },
      ];
      if (isList) {
        parameters.push({
          name: t('args'),
          type: `Prisma.${type}FindManyArgs`,
        });
      }

      this.classMethods.push({
        kind: StructureKind.Method,
        name: camelcase(`resolve_${name}`),
        isAsync: true,
        parameters,
        statements: [
          `
        return this.prisma.client.${this.modelName.camelCase}
        .findUniqueOrThrow({
          where: ${this.resolveParentWhere}
        })
        .${name}(${isList ? 'args' : ''})
      `,
        ],
      });
    }
  }

  private declareCrudMethods() {
    for (const method of CRUD_METHODS) {
      this.declareCrudMethod(method);
    }
  }

  private declareCrudMethod(method: CrudMethod) {
    if (this.hideMap[method]) {
      return;
    }

    this.classMethods.push({
      kind: StructureKind.Method,
      name: method,
      isAsync: true,
      parameters: [
        {
          name: t('args'),
          type: `Prisma.${this.modelName.original}${pascalcase(method)}Args`,
        },
      ],
      statements: [
        `return this.prisma.client.${this.modelName.camelCase}.${method}(args)`,
      ],
    });
  }

  private declareClass() {
    this.classDeclaration = {
      kind: StructureKind.Class,
      name: `${this.modelName.original}ServiceBase`,
      isExported: true,
      ctors: [
        {
          kind: StructureKind.Constructor,
          parameters: [
            {
              name: t('prisma'),
              type: t('PrismaService'),
              scope: Scope.Public,
              isReadonly: true,
            },
          ],
        },
      ],
    };
  }
}
