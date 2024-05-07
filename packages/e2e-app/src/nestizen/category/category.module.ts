import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
