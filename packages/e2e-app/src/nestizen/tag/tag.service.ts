import { TagBaseService } from './base/tag.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TagService extends TagBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
