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
  Parent,
} from '@nestjs/graphql';
import { UserServiceBase } from './user.service.base';
import {
  User,
  FindUniqueUserArgs,
  FindManyUserArgs,
  CreateOneUserArgs,
  UpdateOneUserArgs,
  DeleteOneUserArgs,
  AggregateUser,
  UserAggregateArgs,
  UserGroupBy,
  UserGroupByArgs,
  FindManyPostArgs,
  Post,
  FindManyTagArgs,
  Tag,
  Profile,
} from '../../nestizen/graphql-types';

@Resolver(() => User)
export class UserResolverBase {
  constructor(public readonly service: UserServiceBase) {}

  @Query(() => User, { nullable: true })
  async user(@Args() args: FindUniqueUserArgs) {
    return this.service.findUnique(args);
  }

  @Query(() => [User], { nullable: false })
  async users(@Args() args: FindManyUserArgs) {
    return this.service.findMany(args);
  }

  @Mutation(() => User, { nullable: false })
  async createUser(@Args() args: CreateOneUserArgs) {
    return this.service.create(args);
  }

  @Mutation(() => User, { nullable: false })
  async updateUser(@Args() args: UpdateOneUserArgs) {
    return this.service.update(args);
  }

  @Mutation(() => User, { nullable: false })
  async deleteUser(@Args() args: DeleteOneUserArgs) {
    return this.service.delete(args);
  }

  @Query(() => Int, { nullable: false })
  async userCount(@Args() args: FindManyUserArgs) {
    return this.service.count(args);
  }

  @Query(() => AggregateUser, { nullable: false })
  async userAggregate(@Args() args: UserAggregateArgs) {
    return this.service.aggregate(args);
  }

  @Query(() => [UserGroupBy], { nullable: false })
  async userGroupBy(@Args() args: UserGroupByArgs) {
    return this.service.groupBy(args);
  }

  @ResolveField(() => [Post], { nullable: false })
  async posts(@Parent() parent: User, @Args() args: FindManyPostArgs) {
    return this.service.resolvePosts(parent, args);
  }

  @ResolveField(() => User)
  async parent(@Parent() parent: User) {
    return this.service.resolveParent(parent);
  }

  @ResolveField(() => [User], { nullable: false })
  async children(@Parent() parent: User, @Args() args: FindManyUserArgs) {
    return this.service.resolveChildren(parent, args);
  }

  @ResolveField(() => [Post], { nullable: false })
  async anotherPosts(@Parent() parent: User, @Args() args: FindManyPostArgs) {
    return this.service.resolveAnotherPosts(parent, args);
  }

  @ResolveField(() => [Tag], { nullable: false })
  async tags(@Parent() parent: User, @Args() args: FindManyTagArgs) {
    return this.service.resolveTags(parent, args);
  }

  @ResolveField(() => Profile)
  async profile(@Parent() parent: User) {
    return this.service.resolveProfile(parent);
  }
}