import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
