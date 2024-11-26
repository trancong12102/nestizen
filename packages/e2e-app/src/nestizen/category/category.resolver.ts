import { Resolver } from '@nestjs/graphql';
import { Category } from '../nestizen/graphql-types';
import { CategoryResolverBase } from './base/category.resolver.base';
import { CategoryService } from './category.service';

@Resolver(() => Category)
export class CategoryResolver extends CategoryResolverBase {
  constructor(public readonly service: CategoryService) {
    super(service);
  }
}
