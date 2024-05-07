// This file is generated by @nestizen/graphql-plugin. DO NOT MANUALLY EDIT!
/* eslint-disable */
import { Query, Mutation, Args, Resolver, Int } from '@nestjs/graphql';
import { HiddenModelBaseService } from './hidden-model.base.service';
import { Prisma } from '@prisma/client';
import {
  AggregateHiddenModel,
  HiddenModelAggregateArgs,
  AffectedRowsOutput,
  HiddenModelCreateManyArgs,
  HiddenModelDeleteManyArgs,
  HiddenModel,
  HiddenModelFindFirstArgs,
  HiddenModelFindManyArgs,
  HiddenModelFindUniqueArgs,
  HiddenModelGroupByOutputType,
  HiddenModelGroupByArgs,
  HiddenModelUpdateManyArgs,
  HiddenModelCountArgs,
} from '../../nestizen/graphql-types';

@Resolver(() => HiddenModel)
export class HiddenModelBaseResolver {
  constructor(protected readonly service: HiddenModelBaseService) {}

  @Query(() => AggregateHiddenModel, { nullable: false })
  async aggregateHiddenModel(@Args() args: HiddenModelAggregateArgs) {
    return this.service.aggregate(
      args as unknown as Prisma.HiddenModelAggregateArgs,
    );
  }

  @Mutation(() => AffectedRowsOutput, { nullable: false })
  async createManyHiddenModel(@Args() args: HiddenModelCreateManyArgs) {
    return this.service.createMany(
      args as unknown as Prisma.HiddenModelCreateManyArgs,
    );
  }

  @Mutation(() => AffectedRowsOutput, { nullable: false })
  async deleteManyHiddenModel(@Args() args: HiddenModelDeleteManyArgs) {
    return this.service.deleteMany(
      args as unknown as Prisma.HiddenModelDeleteManyArgs,
    );
  }

  @Query(() => HiddenModel, { nullable: true })
  async findFirstHiddenModel(@Args() args: HiddenModelFindFirstArgs) {
    return this.service.findFirst(
      args as unknown as Prisma.HiddenModelFindFirstArgs,
    );
  }

  @Query(() => [HiddenModel], { nullable: false })
  async findManyHiddenModel(@Args() args: HiddenModelFindManyArgs) {
    return this.service.findMany(
      args as unknown as Prisma.HiddenModelFindManyArgs,
    );
  }

  @Query(() => HiddenModel, { nullable: true })
  async findUniqueHiddenModel(@Args() args: HiddenModelFindUniqueArgs) {
    return this.service.findUnique(
      args as unknown as Prisma.HiddenModelFindUniqueArgs,
    );
  }

  @Query(() => [HiddenModelGroupByOutputType], { nullable: false })
  async groupByHiddenModel(@Args() args: HiddenModelGroupByArgs) {
    return this.service.groupBy(
      args as unknown as Prisma.HiddenModelGroupByArgs,
    );
  }

  @Mutation(() => AffectedRowsOutput, { nullable: false })
  async updateManyHiddenModel(@Args() args: HiddenModelUpdateManyArgs) {
    return this.service.updateMany(
      args as unknown as Prisma.HiddenModelUpdateManyArgs,
    );
  }

  @Query(() => Int, { nullable: false })
  async countHiddenModel(@Args() args: HiddenModelCountArgs) {
    return this.service.count(args as unknown as Prisma.HiddenModelCountArgs);
  }
}
