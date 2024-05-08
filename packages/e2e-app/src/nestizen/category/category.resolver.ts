import { Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryResolverBase } from './base/category.resolver.base';
import { Category } from '../nestizen/graphql-types';

@Resolver(() => Category)
export class CategoryResolver extends CategoryResolverBase {
  constructor(public readonly service: CategoryService) {
    super(service);
  }
}
