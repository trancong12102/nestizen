/**
 * -----------------------------------------------------------------------------
 * WARNING:
 * This file is auto-generated by @nestizen/graphql-plugin.
 * Changes to this file will be lost if the code is regenerated.
 * -----------------------------------------------------------------------------
 */

import {
  Resolver,
  Query,
  Args,
  Mutation,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CategoryServiceBase } from './category.service.base';
import {
  Category,
  FindUniqueCategoryArgs,
  FindManyCategoryArgs,
  CreateOneCategoryArgs,
  UpdateOneCategoryArgs,
  DeleteOneCategoryArgs,
  AggregateCategory,
  CategoryAggregateArgs,
  CategoryMetadata,
} from '../../nestizen/graphql-types';
import { ZenPermission } from '@nestizen/runtime';

@Resolver(() => Category)
export class CategoryResolverBase {
  constructor(public readonly service: CategoryServiceBase) {}

  @Query(() => Category, { nullable: true })
  @ZenPermission('Category', 'read')
  async category(@Args() args: FindUniqueCategoryArgs) {
    return this.service.findUnique(args as any);
  }

  @Query(() => [Category], { nullable: false })
  @ZenPermission('Category', 'read')
  async categories(@Args() args: FindManyCategoryArgs) {
    return this.service.findMany(args as any);
  }

  @Mutation(() => Category, { nullable: false })
  @ZenPermission('Category', 'create')
  async createCategory(@Args() args: CreateOneCategoryArgs) {
    return this.service.create(args as any);
  }

  @Mutation(() => Category, { nullable: false })
  @ZenPermission('Category', 'update')
  async updateCategory(@Args() args: UpdateOneCategoryArgs) {
    return this.service.update(args as any);
  }

  @Mutation(() => Category, { nullable: false })
  @ZenPermission('Category', 'delete')
  async deleteCategory(@Args() args: DeleteOneCategoryArgs) {
    return this.service.delete(args as any);
  }

  @Query(() => Int, { nullable: false })
  @ZenPermission('Category', 'read')
  async categoryCount(@Args() args: FindManyCategoryArgs) {
    return this.service.count(args as any);
  }

  @Query(() => AggregateCategory, { nullable: false })
  @ZenPermission('Category', 'read')
  async categoryAggregate(@Args() args: CategoryAggregateArgs) {
    return this.service.aggregate(args as any);
  }

  @ResolveField(() => CategoryMetadata)
  async metadata(@Parent() parent: Category) {
    return this.service.resolveMetadata(parent);
  }
}
