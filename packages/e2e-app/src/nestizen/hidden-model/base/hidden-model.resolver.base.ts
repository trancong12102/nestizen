/*
------------------------------------------------------------------------------
WARNING:
This file is auto-generated by @nestizen/graphql-plugin.
Changes to this file will be lost if the code is regenerated.
------------------------------------------------------------------------------
*/
/* eslint-disable */

import {
  Resolver,
  Query,
  Mutation,
  ResolveField,
  Args,
  Int,
} from '@nestjs/graphql';
import { HiddenModelServiceBase } from './hidden-model.service.base';
import {
  HiddenModel,
  FindUniqueHiddenModelArgs,
  FindManyHiddenModelArgs,
  CreateOneHiddenModelArgs,
  UpdateOneHiddenModelArgs,
  DeleteOneHiddenModelArgs,
  AggregateHiddenModel,
  HiddenModelAggregateArgs,
  HiddenModelGroupBy,
  HiddenModelGroupByArgs,
} from '../../nestizen/graphql-types';

@Resolver(() => HiddenModel)
export class HiddenModelResolverBase {
  constructor(public readonly service: HiddenModelServiceBase) {}

  @Query(() => HiddenModel, { nullable: true })
  async hiddenModel(@Args() args: FindUniqueHiddenModelArgs) {
    return this.service.findUnique(args);
  }

  @Query(() => [HiddenModel], { nullable: false })
  async hiddenModels(@Args() args: FindManyHiddenModelArgs) {
    return this.service.findMany(args);
  }

  @Mutation(() => HiddenModel, { nullable: false })
  async createHiddenModel(@Args() args: CreateOneHiddenModelArgs) {
    return this.service.create(args);
  }

  @Mutation(() => HiddenModel, { nullable: false })
  async updateHiddenModel(@Args() args: UpdateOneHiddenModelArgs) {
    return this.service.update(args);
  }

  @Mutation(() => HiddenModel, { nullable: false })
  async deleteHiddenModel(@Args() args: DeleteOneHiddenModelArgs) {
    return this.service.delete(args);
  }

  @Query(() => Int, { nullable: false })
  async hiddenModelCount(@Args() args: FindManyHiddenModelArgs) {
    return this.service.count(args);
  }

  @Query(() => AggregateHiddenModel, { nullable: false })
  async hiddenModelAggregate(@Args() args: HiddenModelAggregateArgs) {
    return this.service.aggregate(args);
  }

  @Query(() => [HiddenModelGroupBy], { nullable: false })
  async hiddenModelGroupBy(@Args() args: HiddenModelGroupByArgs) {
    return this.service.groupBy(args);
  }
}