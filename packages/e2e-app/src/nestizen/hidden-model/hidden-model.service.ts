import { HiddenModelBaseService } from './base/hidden-model.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HiddenModelService extends HiddenModelBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
