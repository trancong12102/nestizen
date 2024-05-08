import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HiddenModelServiceBase } from './base/hidden-model.service.base';

@Injectable()
export class HiddenModelService extends HiddenModelServiceBase {
  constructor(public readonly prisma: PrismaService) {
    super(prisma);
  }
}
