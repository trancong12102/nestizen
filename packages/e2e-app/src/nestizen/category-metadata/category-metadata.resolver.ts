import { CategoryMetadataBaseResolver } from './base/category-metadata.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { CategoryMetadataService } from './category-metadata.service';
import { CategoryMetadata } from '../nestizen/graphql-types';

@Resolver(() => CategoryMetadata)
export class CategoryMetadataResolver extends CategoryMetadataBaseResolver {
  constructor(protected readonly service: CategoryMetadataService) {
    super(service);
  }
}
