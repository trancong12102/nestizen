import { Resolver } from '@nestjs/graphql';
import { CategoryMetadata } from '../nestizen/graphql-types';
import { CategoryMetadataResolverBase } from './base/category-metadata.resolver.base';
import { CategoryMetadataService } from './category-metadata.service';

@Resolver(() => CategoryMetadata)
export class CategoryMetadataResolver extends CategoryMetadataResolverBase {
  constructor(public readonly service: CategoryMetadataService) {
    super(service);
  }
}
