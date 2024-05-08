import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProfileServiceBase } from './base/profile.service.base';

@Injectable()
export class ProfileService extends ProfileServiceBase {
  constructor(public readonly prisma: PrismaService) {
    super(prisma);
  }
}
