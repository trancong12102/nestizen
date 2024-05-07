import { PostBaseResolver } from './base/post.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from '../nestizen/graphql-types';

@Resolver(() => Post)
export class PostResolver extends PostBaseResolver {
  constructor(protected readonly service: PostService) {
    super(service);
  }
}
