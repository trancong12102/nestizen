import { Module } from '@nestjs/common';
import { CategoryMetadataService } from './category-metadata.service';
import { CategoryMetadataResolver } from './category-metadata.resolver';

@Module({
  providers: [CategoryMetadataService, CategoryMetadataResolver],
})
export class CategoryMetadataModule {}
