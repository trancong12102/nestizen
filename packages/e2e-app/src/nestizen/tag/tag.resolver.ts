import { Resolver } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { TagResolverBase } from './base/tag.resolver.base';
import { Tag } from '../nestizen/graphql-types';

@Resolver(() => Tag)
export class TagResolver extends TagResolverBase {
  constructor(public readonly service: TagService) {
    super(service);
  }
}
