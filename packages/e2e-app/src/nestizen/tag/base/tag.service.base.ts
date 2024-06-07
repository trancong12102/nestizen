/**
 * -----------------------------------------------------------------------------
 * WARNING:
 * This file is auto-generated by @nestizen/graphql-plugin.
 * Changes to this file will be lost if the code is regenerated.
 * -----------------------------------------------------------------------------
 */

import { Prisma, Tag } from '@zenstackhq/runtime/models';
import { PrismaService } from '../../../prisma/prisma.service';

export class TagServiceBase {
  constructor(public readonly prisma: PrismaService) {}

  async findUnique(args: Prisma.TagFindUniqueArgs) {
    return this.prisma.client.tag.findUnique(args);
  }

  async findMany(args: Prisma.TagFindManyArgs) {
    return this.prisma.client.tag.findMany(args);
  }

  async create(args: Prisma.TagCreateArgs) {
    return this.prisma.client.tag.create(args);
  }

  async update(args: Prisma.TagUpdateArgs) {
    return this.prisma.client.tag.update(args);
  }

  async delete(args: Prisma.TagDeleteArgs) {
    return this.prisma.client.tag.delete(args);
  }

  async count(args: Prisma.TagCountArgs) {
    return this.prisma.client.tag.count(args);
  }

  async aggregate(args: Prisma.TagAggregateArgs) {
    return this.prisma.client.tag.aggregate(args);
  }

  async resolveUsers(parent: Tag, args: Prisma.UserFindManyArgs) {
    return this.prisma.client.tag
      .findUniqueOrThrow({
        where: { key: parent.key },
      })
      .users(args);
  }
}
