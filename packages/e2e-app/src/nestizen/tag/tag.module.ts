import { Module } from '@nestjs/common';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  providers: [TagService, TagResolver],
})
export class TagModule {}
