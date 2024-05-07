import { CategoryBaseResolver } from './base/category.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from '../nestizen/graphql-types';

@Resolver(() => Category)
export class CategoryResolver extends CategoryBaseResolver {
  constructor(protected readonly service: CategoryService) {
    super(service);
  }
}
