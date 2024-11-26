import { Resolver } from '@nestjs/graphql';
import { Tag } from '../nestizen/graphql-types';
import { TagResolverBase } from './base/tag.resolver.base';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver extends TagResolverBase {
  constructor(public readonly service: TagService) {
    super(service);
  }
}
