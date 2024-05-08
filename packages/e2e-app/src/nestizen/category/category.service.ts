import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryServiceBase } from './base/category.service.base';

@Injectable()
export class CategoryService extends CategoryServiceBase {
  constructor(public readonly prisma: PrismaService) {
    super(prisma);
  }
}
