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
import { pluralize } from '../helpers/pluralize';
import camelcase from '@stdlib/string-camelcase';
import { ProjectStructure } from '../helpers/project-structure';
import { optimizeImports } from '../helpers/optimize-imports';
import { OperationsHideMap } from '../helpers/get-operations-hide-map';
import { getRelativeImportModuleSpecifier } from '../helpers/get-relative-import-module-modifier';
import { ModelNameVariants } from '../types/model-name-variants';
import { CrudMethod } from '../types/crud-method';
import { GeneratorKeyword } from '../types/generator-keyword';
import { checkShouldHideResolveFunction } from '../helpers/check-should-hide-resolve-function';
import { GENERATED_FILE_COMMENTS } from '../../contants';
import { GenerateOptions } from '../../types';

export class BaseResolverGenerator {
  private readonly modelName: ModelNameVariants;
  private sourceFile: SourceFileStructure;
  private classDeclaration: ClassDeclarationStructure;
  private readonly imports: ImportDeclarationStructure[] = [];
  private classMethods: MethodDeclarationStructure[] = [];
  private typesImportModuleModifier: string;

  constructor(
    private readonly project: ProjectStructure,
    private readonly model: DMMF.Model,
    private readonly options: GenerateOptions,
    private readonly operationsHideMap: OperationsHideMap,
  ) {
    this.modelName = getModelNameVariants(model.name);
  }

  generate() {
    const { graphqlTypesSourcePath, output } = this.options;
    const sourcePath = path.resolve(
      output,
      this.modelName.kebab,
      'base',
      `${this.modelName.kebab}.resolver.base.ts`,
    );
    this.typesImportModuleModifier = getRelativeImportModuleSpecifier(
      sourcePath,
      graphqlTypesSourcePath,
    );

    this.sourceFile = {
      kind: StructureKind.SourceFile,
    };

    this.imports.push(
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [
          t('Resolver'),
          t('Query'),
          t('Mutation'),
          t('ResolveField'),
          t('Args'),
        ],
        moduleSpecifier: t('@nestjs/graphql'),
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Int')],
        moduleSpecifier: t('@nestjs/graphql'),
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

    if (relations.length > 0) {
      this.imports.push({
        kind: StructureKind.ImportDeclaration,
        namedImports: [t('Parent')],
        moduleSpecifier: t('@nestjs/graphql'),
      });
    }

    for (const relation of relations) {
      const { name, type, isList, isRequired, documentation } = relation;
      if (checkShouldHideResolveFunction(documentation)) {
        continue;
      }

      const FindManyRelationArgs = `FindMany${type}Args`;

      const decoratorArguments: string[] = [
        `() => ${isList ? `[${type}]` : type}`,
      ];
      const parameters: OptionalKind<ParameterDeclarationStructure>[] = [
        {
          name: t('parent'),
          type: this.modelName.original,
          decorators: [
            {
              name: 'Parent',
              arguments: [],
            },
          ],
        },
      ];
      if (isList) {
        decoratorArguments.push(`{ nullable: ${!isRequired} }`);
        parameters.push({
          name: t('args'),
          type: FindManyRelationArgs,
          decorators: [
            {
              name: 'Args',
              arguments: [],
            },
          ],
        });
        this.imports.push({
          kind: StructureKind.ImportDeclaration,
          namedImports: [FindManyRelationArgs],
          moduleSpecifier: this.typesImportModuleModifier,
        });
      }

      this.classMethods.push({
        kind: StructureKind.Method,
        name,
        isAsync: true,
        decorators: [
          {
            name: 'ResolveField',
            arguments: decoratorArguments,
          },
        ],
        parameters: parameters,
        statements: [
          `
        return this.service.${camelcase(`resolve_${name}`)}(parent${
          isList ? `, args` : ''
        })
      `,
        ],
      });

      this.imports.push({
        kind: StructureKind.ImportDeclaration,
        namedImports: [type],
        moduleSpecifier: this.typesImportModuleModifier,
      });
    }
  }

  private declareCrudMethods() {
    const methodSpecs: Parameters<typeof this.declareCrudMethod>[0][] = [
      {
        name: this.modelName.camelCase,
        method: 'findUnique',
        argsType: `FindUnique${this.modelName.original}Args`,
        nullable: true,
        graphqlReturnType: this.modelName.original,
        type: 'Query',
        imports: [this.modelName.original],
        hide: this.operationsHideMap.READ,
      },
      {
        name: pluralize(this.modelName.camelCase),
        method: 'findMany',
        argsType: `FindMany${this.modelName.original}Args`,
        nullable: false,
        graphqlReturnType: `[${this.modelName.original}]`,
        type: 'Query',
        imports: [this.modelName.original],
        hide: this.operationsHideMap.LIST,
      },
      {
        name: camelcase(`create_${this.modelName.camelCase}`),
        method: 'create',
        argsType: `CreateOne${this.modelName.original}Args`,
        nullable: false,
        graphqlReturnType: this.modelName.original,
        type: 'Mutation',
        imports: [this.modelName.original],
        hide: this.operationsHideMap.CREATE,
      },
      {
        name: camelcase(`update_${this.modelName.camelCase}`),
        method: 'update',
        argsType: `UpdateOne${this.modelName.original}Args`,
        nullable: false,
        graphqlReturnType: this.modelName.original,
        type: 'Mutation',
        imports: [this.modelName.original],
        hide: this.operationsHideMap.UPDATE,
      },
      {
        name: camelcase(`delete_${this.modelName.camelCase}`),
        method: 'delete',
        argsType: `DeleteOne${this.modelName.original}Args`,
        nullable: false,
        graphqlReturnType: this.modelName.original,
        type: 'Mutation',
        imports: [this.modelName.original],
        hide: this.operationsHideMap.DELETE,
      },
      {
        name: camelcase(`${this.modelName.camelCase}_count`),
        method: 'count',
        argsType: `FindMany${this.modelName.original}Args`,
        nullable: false,
        graphqlReturnType: t('Int'),
        type: 'Query',
        imports: [],
        hide: this.operationsHideMap.LIST,
      },
      {
        name: camelcase(`${this.modelName.camelCase}_aggregate`),
        method: 'aggregate',
        argsType: `${this.modelName.original}AggregateArgs`,
        nullable: false,
        graphqlReturnType: `Aggregate${this.modelName.original}`,
        type: 'Query',
        imports: [`Aggregate${this.modelName.original}`],
        hide: this.operationsHideMap.LIST,
      },
      {
        name: camelcase(`${this.modelName.camelCase}_group_by`),
        method: 'groupBy',
        argsType: `${this.modelName.original}GroupByArgs`,
        nullable: false,
        graphqlReturnType: `[${this.modelName.original}GroupBy]`,
        type: 'Query',
        imports: [`${this.modelName.original}GroupBy`],
        hide: this.operationsHideMap.LIST,
      },
    ];

    for (const spec of methodSpecs) {
      this.declareCrudMethod(spec);
    }
  }

  private declareCrudMethod(options: {
    name: string;
    method: CrudMethod;
    argsType: string;
    nullable: boolean;
    graphqlReturnType: string;
    type: Extract<GeneratorKeyword, 'Query' | 'Mutation'>;
    imports: string[];
    hide: boolean;
  }) {
    const {
      name,
      method,
      nullable,
      graphqlReturnType,
      argsType,
      type,
      imports,
      hide,
    } = options;
    if (hide) {
      return;
    }

    this.classMethods.push({
      kind: StructureKind.Method,
      name,
      isAsync: true,
      parameters: [
        {
          name: t('args'),
          type: argsType,
          decorators: [
            {
              name: t('Args'),
              arguments: [],
            },
          ],
        },
      ],
      decorators: [
        {
          name: type,
          arguments: [
            `() => ${graphqlReturnType}`,
            JSON.stringify({
              nullable,
            }),
          ],
        },
      ],
      statements: [`return this.service.${method}(args)`],
    });
    this.imports.push(
      ...imports.map<ImportDeclarationStructure>((i) => ({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: this.typesImportModuleModifier,
        namedImports: [i],
      })),
      {
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: this.typesImportModuleModifier,
        namedImports: [argsType],
      },
    );
  }

  private declareClass() {
    const ServiceBaseType = `${this.modelName.original}ServiceBase`;

    this.classDeclaration = {
      kind: StructureKind.Class,
      name: `${this.modelName.original}ResolverBase`,
      isExported: true,
      decorators: [
        {
          name: t('Resolver'),
          arguments: [`() => ${this.modelName.original}`],
        },
      ],
      ctors: [
        {
          parameters: [
            {
              name: t('service'),
              type: ServiceBaseType,
              scope: Scope.Public,
              isReadonly: true,
            },
          ],
        },
      ],
    };

    this.imports.push({
      kind: StructureKind.ImportDeclaration,
      namedImports: [ServiceBaseType],
      moduleSpecifier: `./${this.modelName.kebab}.service.base`,
    });
  }
}
