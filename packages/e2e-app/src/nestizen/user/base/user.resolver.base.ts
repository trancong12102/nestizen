/**
 * -----------------------------------------------------------------------------
 * WARNING:
 * This file is auto-generated by @nestizen/graphql-plugin.
 * Changes to this file will be lost if the code is regenerated.
 * -----------------------------------------------------------------------------
 */

import { ZenPermission } from '@nestizen/runtime';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AggregateUser,
  CreateOneUserArgs,
  DeleteOneUserArgs,
  FindManyPostArgs,
  FindManyTagArgs,
  FindManyUserArgs,
  FindUniqueUserArgs,
  Post,
  Profile,
  Tag,
  UpdateOneUserArgs,
  User,
  UserAggregateArgs,
} from '../../nestizen/graphql-types';
import { UserServiceBase } from './user.service.base';

@Resolver(() => User)
export class UserResolverBase {
  constructor(public readonly service: UserServiceBase) {}

  @Query(() => User, { nullable: true })
  @ZenPermission('User', 'read')
  async user(@Args() args: FindUniqueUserArgs) {
    return this.service.findUnique(args as any);
  }

  @Query(() => [User], { nullable: false })
  @ZenPermission('User', 'read')
  async users(@Args() args: FindManyUserArgs) {
    return this.service.findMany(args as any);
  }

  @Mutation(() => User, { nullable: false })
  @ZenPermission('User', 'create')
  async createUser(@Args() args: CreateOneUserArgs) {
    return this.service.create(args as any);
  }

  @Mutation(() => User, { nullable: false })
  @ZenPermission('User', 'update')
  async updateUser(@Args() args: UpdateOneUserArgs) {
    return this.service.update(args as any);
  }

  @Mutation(() => User, { nullable: false })
  @ZenPermission('User', 'delete')
  async deleteUser(@Args() args: DeleteOneUserArgs) {
    return this.service.delete(args as any);
  }

  @Query(() => Int, { nullable: false })
  @ZenPermission('User', 'read')
  async userCount(@Args() args: FindManyUserArgs) {
    return this.service.count(args as any);
  }

  @Query(() => AggregateUser, { nullable: false })
  @ZenPermission('User', 'read')
  async userAggregate(@Args() args: UserAggregateArgs) {
    return this.service.aggregate(args as any);
  }

  @ResolveField(() => [Post], { nullable: false })
  async posts(@Parent() parent: User, @Args() args: FindManyPostArgs) {
    return this.service.resolvePosts(parent, args as any);
  }

  @ResolveField(() => User)
  async parent(@Parent() parent: User) {
    return this.service.resolveParent(parent);
  }

  @ResolveField(() => [User], { nullable: false })
  async children(@Parent() parent: User, @Args() args: FindManyUserArgs) {
    return this.service.resolveChildren(parent, args as any);
  }

  @ResolveField(() => [Post], { nullable: false })
  async anotherPosts(@Parent() parent: User, @Args() args: FindManyPostArgs) {
    return this.service.resolveAnotherPosts(parent, args as any);
  }

  @ResolveField(() => [Tag], { nullable: false })
  async tags(@Parent() parent: User, @Args() args: FindManyTagArgs) {
    return this.service.resolveTags(parent, args as any);
  }

  @ResolveField(() => Profile)
  async profile(@Parent() parent: User) {
    return this.service.resolveProfile(parent);
  }
}
