import { Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostResolverBase } from './base/post.resolver.base';
import { Post } from '../nestizen/graphql-types';

@Resolver(() => Post)
export class PostResolver extends PostResolverBase {
  constructor(public readonly service: PostService) {
    super(service);
  }
}
