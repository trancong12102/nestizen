import { UserBaseService } from './base/user.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService extends UserBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
