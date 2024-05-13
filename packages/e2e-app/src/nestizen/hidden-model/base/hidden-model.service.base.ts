/**
 * -----------------------------------------------------------------------------
 * WARNING:
 * This file is auto-generated by @nestizen/graphql-plugin.
 * Changes to this file will be lost if the code is regenerated.
 * -----------------------------------------------------------------------------
 */

/* eslint-disable */
import { Prisma } from '@zenstackhq/runtime/models';
import { PrismaService } from '../../../prisma/prisma.service';

export class HiddenModelServiceBase {
  constructor(public readonly prisma: PrismaService) {}

  async findUnique(args: Prisma.HiddenModelFindUniqueArgs) {
    return this.prisma.client.hiddenModel.findUnique(args);
  }

  async findMany(args: Prisma.HiddenModelFindManyArgs) {
    return this.prisma.client.hiddenModel.findMany(args);
  }

  async create(args: Prisma.HiddenModelCreateArgs) {
    return this.prisma.client.hiddenModel.create(args);
  }

  async update(args: Prisma.HiddenModelUpdateArgs) {
    return this.prisma.client.hiddenModel.update(args);
  }

  async delete(args: Prisma.HiddenModelDeleteArgs) {
    return this.prisma.client.hiddenModel.delete(args);
  }

  async count(args: Prisma.HiddenModelCountArgs) {
    return this.prisma.client.hiddenModel.count(args);
  }

  async aggregate(args: Prisma.HiddenModelAggregateArgs) {
    return this.prisma.client.hiddenModel.aggregate(args);
  }
}
