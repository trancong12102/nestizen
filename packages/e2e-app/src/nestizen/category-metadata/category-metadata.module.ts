import { Module } from '@nestjs/common';
import { CategoryMetadataResolver } from './category-metadata.resolver';
import { CategoryMetadataService } from './category-metadata.service';

@Module({
  providers: [CategoryMetadataService, CategoryMetadataResolver],
})
export class CategoryMetadataModule {}
