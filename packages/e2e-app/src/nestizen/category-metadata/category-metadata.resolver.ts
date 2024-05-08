import { Resolver } from '@nestjs/graphql';
import { CategoryMetadataService } from './category-metadata.service';
import { CategoryMetadataResolverBase } from './base/category-metadata.resolver.base';
import { CategoryMetadata } from '../nestizen/graphql-types';

@Resolver(() => CategoryMetadata)
export class CategoryMetadataResolver extends CategoryMetadataResolverBase {
  constructor(public readonly service: CategoryMetadataService) {
    super(service);
  }
}
