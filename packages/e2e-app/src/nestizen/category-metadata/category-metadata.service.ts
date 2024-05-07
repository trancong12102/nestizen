import { CategoryMetadataBaseService } from './base/category-metadata.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryMetadataService extends CategoryMetadataBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
