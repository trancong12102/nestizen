import { TagBaseResolver } from './base/tag.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from '../nestizen/graphql-types';

@Resolver(() => Tag)
export class TagResolver extends TagBaseResolver {
  constructor(protected readonly service: TagService) {
    super(service);
  }
}
