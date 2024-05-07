import { PostBaseService } from './base/post.base.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostService extends PostBaseService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
