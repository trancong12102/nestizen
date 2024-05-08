import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryMetadataServiceBase } from './base/category-metadata.service.base';

@Injectable()
export class CategoryMetadataService extends CategoryMetadataServiceBase {
  constructor(public readonly prisma: PrismaService) {
    super(prisma);
  }
}
