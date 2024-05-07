import { TagService } from './tag.service';
import { TagResolver } from './tag.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [TagService, TagResolver],
  exports: [TagService],
})
export class TagModule {}
