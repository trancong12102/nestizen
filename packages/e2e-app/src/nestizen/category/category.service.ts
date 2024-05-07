import { CategoryBaseService } from './base/category.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService extends CategoryBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
