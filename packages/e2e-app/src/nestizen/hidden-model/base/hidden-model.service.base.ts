import { PrismaService } from '../../../prisma/prisma.service';

export class HiddenModelServiceBase {
  constructor(public readonly prisma: PrismaService) {}
}
