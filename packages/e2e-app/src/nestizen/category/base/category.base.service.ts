// This file is generated by @nestizen/graphql-plugin. DO NOT MANUALLY EDIT!
/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategoryBaseService {
  constructor(protected readonly prisma: PrismaService) {}

  async aggregate(args: Prisma.CategoryAggregateArgs) {
    return this.prisma.client.category.aggregate(args);
  }

  async createMany(args: Prisma.CategoryCreateManyArgs) {
    return this.prisma.client.category.createMany(args);
  }

  async deleteMany(args: Prisma.CategoryDeleteManyArgs) {
    return this.prisma.client.category.deleteMany(args);
  }

  async findFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.prisma.client.category.findFirst(args);
  }

  async findMany(args: Prisma.CategoryFindManyArgs) {
    return this.prisma.client.category.findMany(args);
  }

  async findUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.prisma.client.category.findUnique(args);
  }

  async groupBy(args: Prisma.CategoryGroupByArgs) {
    return this.prisma.client.category.groupBy(args);
  }

  async updateMany(args: Prisma.CategoryUpdateManyArgs) {
    return this.prisma.client.category.updateMany(args);
  }

  async count(args: Prisma.CategoryCountArgs) {
    return this.prisma.client.category.count(args);
  }

  async posts(parent: Category, args: Prisma.PostFindManyArgs) {
    return this.prisma.client.category
      .findUniqueOrThrow({
        where: {
          id: parent.id,
        },
      })
      .posts(args);
  }

  async metadata(parent: Category) {
    return this.prisma.client.category
      .findUniqueOrThrow({
        where: {
          id: parent.id,
        },
      })
      .metadata();
  }
}
