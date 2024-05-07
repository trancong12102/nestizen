import { CategoryMetadataService } from './category-metadata.service';
import { CategoryMetadataResolver } from './category-metadata.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [CategoryMetadataService, CategoryMetadataResolver],
  exports: [CategoryMetadataService],
})
export class CategoryMetadataModule {}
