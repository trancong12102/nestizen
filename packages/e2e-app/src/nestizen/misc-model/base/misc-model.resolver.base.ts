/*
------------------------------------------------------------------------------
WARNING:
This file is auto-generated by @nestizen/graphql-plugin.
Changes to this file will be lost if the code is regenerated.
------------------------------------------------------------------------------
*/
/* eslint-disable */

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MiscModelServiceBase } from './misc-model.service.base';
import {
  MiscModel,
  FindUniqueMiscModelArgs,
  FindManyMiscModelArgs,
  DeleteOneMiscModelArgs,
  AggregateMiscModel,
  MiscModelAggregateArgs,
} from '../../nestizen/graphql-types';

@Resolver(() => MiscModel)
export class MiscModelResolverBase {
  constructor(public readonly service: MiscModelServiceBase) {}

  @Query(() => MiscModel, { nullable: true })
  async miscModel(@Args() args: FindUniqueMiscModelArgs) {
    return this.service.findUnique(args);
  }

  @Query(() => [MiscModel], { nullable: false })
  async miscModels(@Args() args: FindManyMiscModelArgs) {
    return this.service.findMany(args);
  }

  @Mutation(() => MiscModel, { nullable: false })
  async deleteMiscModel(@Args() args: DeleteOneMiscModelArgs) {
    return this.service.delete(args);
  }

  @Query(() => Int, { nullable: false })
  async miscModelCount(@Args() args: FindManyMiscModelArgs) {
    return this.service.count(args);
  }

  @Query(() => AggregateMiscModel, { nullable: false })
  async miscModelAggregate(@Args() args: MiscModelAggregateArgs) {
    return this.service.aggregate(args);
  }
}
