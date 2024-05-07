import { BaseModulesBuilder } from './base-modules-builder';
import {
  ClassMethodStructure,
  ImportDeclarationStructure,
  SourceFile,
} from '../types/ts-morph';
import { ModelMapping, ModelOperation } from '../ast/types';
import {
  getModelBaseServicePath,
  getModelBaseService,
  getPrismaNamespacedTypeName,
  writeResolveRelationStatement,
} from './utils';
import {
  ClassDeclarationStructure,
  MethodDeclarationStructure,
  OptionalKind,
  ParameterDeclarationStructure,
  Scope,
  StructureKind,
} from 'ts-morph';
import {
  CommonImport,
  CommonModuleSpecifier,
} from '../contants/common-imports';
import { emptyPromise } from '../utils/misc';
import { getRelativeImportModuleSpecifier } from '../utils/import';
import camelcase from '@stdlib/string-camelcase';
import { DMMF } from '@prisma/generator-helper';

export class BaseServicesBuilder extends BaseModulesBuilder {
  async build(): Promise<SourceFile[]> {
    await emptyPromise();
    const { mappings } = this.ast;
    return mappings.map((mapping) => this.buildServiceFile(mapping)).concat();
  }

  buildServiceFile(mapping: ModelMapping): SourceFile {
    const { model, operations } = mapping;
    const { output, prismaClientPath, prismaServiceName, prismaServicePath } =
      this.generateOptions;
    const sourcePath = getModelBaseServicePath(output, model);
    const prismaClientModuleSpecifier = getRelativeImportModuleSpecifier(
      sourcePath,
      prismaClientPath,
    );

    const imports: ImportDeclarationStructure[] = [
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [CommonImport.Injectable],
        moduleSpecifier: CommonModuleSpecifier.NestCommon,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [CommonImport.Prisma],
        moduleSpecifier: prismaClientModuleSpecifier,
      },
      {
        kind: StructureKind.ImportDeclaration,
        namedImports: [prismaServiceName],
        moduleSpecifier: getRelativeImportModuleSpecifier(
          sourcePath,
          prismaServicePath,
        ),
      },
    ];
    const methods: OptionalKind<MethodDeclarationStructure>[] = [];

    for (const operation of operations) {
      const method = this.buildOperation(model, operation);
      imports.push(...method.imports);
      methods.push(method.method);
    }

    const datamodel = this.ast.getModel(model);
    const relationOperations = this.buildRelationOperations(datamodel);
    for (const relationOperation of relationOperations) {
      imports.push(...relationOperation.imports);
      methods.push(relationOperation.method);
    }

    if (relationOperations.length > 0) {
      imports.push({
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: prismaClientModuleSpecifier,
        namedImports: [model],
      });
    }

    const classDeclaration: ClassDeclarationStructure = {
      kind: StructureKind.Class,
      name: getModelBaseService(model),
      isExported: true,
      methods,
      decorators: [
        {
          name: CommonImport.Injectable,
          arguments: [],
        },
      ],
      ctors: [
        {
          parameters: [
            {
              isReadonly: true,
              scope: Scope.Protected,
              name: 'prisma',
              type: this.generateOptions.prismaServiceName,
            },
          ],
        },
      ],
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

  buildRelationOperations(model: DMMF.Model): ClassMethodStructure[] {
    const relationFields = model.fields.filter((f) => f.relationName);

    return relationFields.map((field) =>
      this.buildRelationOperation(model, field),
    );
  }

  buildRelationOperation(
    model: DMMF.Model,
    field: DMMF.Field,
  ): ClassMethodStructure {
    const { type, isList, name } = field;

    const parameters: OptionalKind<ParameterDeclarationStructure>[] = [
      {
        kind: StructureKind.Parameter,
        name: 'parent',
        type: model.name,
      },
    ];

    const imports: ImportDeclarationStructure[] = [];

    if (isList) {
      const findManyArgsTypeName = getPrismaNamespacedTypeName(
        `${type}FindManyArgs`,
      );

      parameters.push({
        kind: StructureKind.Parameter,
        name: 'args',
        type: findManyArgsTypeName,
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
          (writer) =>
            writeResolveRelationStatement(
              writer,
              model,
              camelcase(model.name),
              name,
              isList,
            ),
        ],
      },
    };
  }

  buildOperation(
    model: string,
    operation: ModelOperation,
  ): ClassMethodStructure {
    const { argsTypeName, action } = operation;

    return {
      imports: [],
      method: {
        kind: StructureKind.Method,
        name: action,
        isAsync: true,
        parameters: [
          {
            kind: StructureKind.Parameter,
            name: 'args',
            type: getPrismaNamespacedTypeName(argsTypeName),
          },
        ],
        statements: [
          `return this.prisma.client.${camelcase(model)}.${action}(args);`,
        ],
      },
    };
  }
}
