import { ProfileBaseService } from './base/profile.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProfileService extends ProfileBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
