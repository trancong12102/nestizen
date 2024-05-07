import { BaseModulesBuilder } from './base-modules-builder';
import {
  ClassMethodStructure,
  ImportDeclarationStructure,
  SourceFile,
} from '../types/ts-morph';
import { emptyPromise } from '../utils/misc';
import { ModelMapping, ModelOperation } from '../ast/types';
import {
  getModelBaseResolverPath,
  getModelBaseServicePath,
  getModelBaseResolver,
  getModelBaseService,
  getPrismaNamespacedTypeName,
  getResolverFunctionName,
} from './utils';
import {
  ClassDeclarationStructure,
  MethodDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
  Scope,
  StructureKind,
} from 'ts-morph';
import { getRelativeImportModuleSpecifier } from '../utils/import';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { getGraphqlListType } from '../types-builder/utils';
import { getScalarType } from '../types-builder/scalar-type';
import { DMMF } from '@prisma/generator-helper';
import camelcase from '@stdlib/string-camelcase';

export class BaseResolversBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    await emptyPromise();
    const { mappings } = this.ast;
    return mappings.map((mapping) => this.buildResolverFile(mapping));
  }

  buildResolverFile(mapping: ModelMapping): SourceFile {
    const { model, operations } = mapping;
    const { output, prismaClientPath } = this.generateOptions;
    const servicePath = getModelBaseServicePath(output, model);
    const sourcePath = getModelBaseResolverPath(output, model);
    const prismaClientModuleSpecifier = getRelativeImportModuleSpecifier(
      sourcePath,
      prismaClientPath,
    );
    const typesOutputModuleSpecifier = getRelativeImportModuleSpecifier(
      sourcePath,
      this.typesOutputPath,
    );

    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [
          CommonImport.Query,
          CommonImport.Mutation,
          CommonImport.Args,
          CommonImport.Resolver,
        ],
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [getModelBaseService(model)],
        moduleSpecifier: getRelativeImportModuleSpecifier(
          sourcePath,
          servicePath,
        ),
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [CommonImport.Prisma],
        moduleSpecifier: prismaClientModuleSpecifier,
      },
    ];
    const methods: OptionalKind<MethodDeclarationStructure>[] = [];
    for (const operation of operations) {
      const { imports: operationImports, method: operationMethod } =
        this.buildOperation(model, typesOutputModuleSpecifier, operation);
      imports.push(...operationImports);
      methods.push(operationMethod);
    }

    const datamodel = this.ast.getModel(model);
    const relationOperations = this.buildRelationOperations(
      typesOutputModuleSpecifier,
      datamodel,
    );
    for (const relationOperation of relationOperations) {
      imports.push(...relationOperation.imports);
      methods.push(relationOperation.method);
    }
    if (relationOperations.length > 0) {
      imports.push({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: CommonModuleSpecifier.NestGraphql,
        namedImports: [CommonImport.ResolveField, CommonImport.Parent],
      });
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: getModelBaseResolver(model),
      isExported: true,
      decorators: [
        {
          name: 'Resolver',
          arguments: [`() => ${model}`],
        },
      ],
      ctors: [
        {
          parameters: [
            {
              isReadonly: true,
              scope: Scope.Protected,
              name: 'service',
              type: getModelBaseService(model),
            },
          ],
        },
      ],
      methods,
    };

    return {
      path: sourcePath,
      structure: {
        imports,
        statements: [classDeclaration],
      },
      disableEslint: true,
      overwrite: true,
    };
  }

  buildRelationOperations(
    typesOutputModuleSpecifier: string,
    model: DMMF.Model,
  ): ClassMethodStructure[] {
    const relationFields = model.fields.filter((f) => f.relationName);

    return relationFields.map((field) =>
      this.buildRelationOperation(typesOutputModuleSpecifier, model, field),
    );
  }

  buildRelationOperation(
    typesOutputModuleSpecifier: string,
    model: DMMF.Model,
    field: DMMF.Field,
  ): ClassMethodStructure {
    const { type, isList, name, isRequired } = field;

    const parameters: OptionalKind<ParameterDeclarationStructure>[] = [
      {
        kind: StructureKind.Parameter,
        name: 'parent',
        type: model.name,
        decorators: [
          {
            kind: StructureKind.Decorator,
            name: 'Parent',
            arguments: [],
          },
        ],
      },
    ];

    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [type],
        moduleSpecifier: typesOutputModuleSpecifier,
      },
    ];

    const findManyArgsTypeName = `${type}FindManyArgs`;
    if (isList) {
      parameters.push({
        kind: StructureKind.Parameter,
        name: 'args',
        type: findManyArgsTypeName,
        decorators: [
          {
            name: 'Args',
            arguments: [],
          },
        ],
      });

      imports.push({
        kind: StructureKind.ImportDeclaration,
        namedImports: [findManyArgsTypeName],
        moduleSpecifier: typesOutputModuleSpecifier,
      });
    }

    return {
      imports,
      method: {
        kind: StructureKind.Method,
        isAsync: true,
        name: camelcase(name),
        parameters,
        statements: [
          `return this.service.${camelcase(name)}(parent${isList ? `, args as unknown as ${getPrismaNamespacedTypeName(findManyArgsTypeName)}` : ''});`,
        ],
        decorators: [
          {
            name: 'ResolveField',
            arguments: [
              `() => ${type}`,
              JSON.stringify({
                nullable: !isRequired,
              }),
            ],
          },
        ],
      },
    };
  }

  buildOperation(
    model: string,
    typesOutputModuleSpecifier: string,
    operation: ModelOperation,
  ): ClassMethodStructure {
    const {
      type: operationType,
      action,
      isNullable,
      outputType: { type: outputType, isList },
      argsTypeName,
    } = operation;

    const scalar = getScalarType(outputType);
    const graphqlOutputType = scalar ? scalar.graphqlType : outputType;
    const imports: ImportDeclarationStructure[] = scalar
      ? [...scalar.imports]
      : [
          {
            kind: StructureKind.ImportDeclaration,
            moduleSpecifier: typesOutputModuleSpecifier,
            namedImports: [graphqlOutputType],
          },
        ];

    imports.push({
      kind: StructureKind.ImportDeclaration,
      namedImports: [argsTypeName],
      moduleSpecifier: typesOutputModuleSpecifier,
    });

    return {
      imports,
      method: {
        kind: StructureKind.Method,
        isAsync: true,
        name: getResolverFunctionName(model, action),
        decorators: [
          {
            name: operationType,
            arguments: [
              `() => ${getGraphqlListType(graphqlOutputType, isList)}`,
              JSON.stringify({
                nullable: isNullable,
              }),
            ],
          },
        ],
        parameters: [
          {
            decorators: [
              {
                kind: StructureKind.Decorator,
                name: 'Args',
                arguments: [],
              },
            ],
            name: 'args',
            type: argsTypeName,
          },
        ],
        statements: [
          `
          return this.service.${action}(args as unknown as ${getPrismaNamespacedTypeName(argsTypeName)});
          `,
        ],
      },
    };
  }
}
