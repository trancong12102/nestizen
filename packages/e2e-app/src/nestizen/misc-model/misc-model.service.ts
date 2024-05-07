import { MiscModelBaseService } from './base/misc-model.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MiscModelService extends MiscModelBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
