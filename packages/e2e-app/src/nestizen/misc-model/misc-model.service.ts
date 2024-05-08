import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MiscModelServiceBase } from './base/misc-model.service.base';

@Injectable()
export class MiscModelService extends MiscModelServiceBase {
  constructor(public readonly prisma: PrismaService) {
    super(prisma);
  }
}
