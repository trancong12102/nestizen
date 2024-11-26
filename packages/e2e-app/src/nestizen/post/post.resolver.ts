import { Resolver } from '@nestjs/graphql';
import { Post } from '../nestizen/graphql-types';
import { PostResolverBase } from './base/post.resolver.base';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver extends PostResolverBase {
  constructor(public readonly service: PostService) {
    super(service);
  }
}
