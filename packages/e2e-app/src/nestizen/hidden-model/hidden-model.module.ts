import { HiddenModelService } from './hidden-model.service';
import { HiddenModelResolver } from './hidden-model.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [HiddenModelService, HiddenModelResolver],
  exports: [HiddenModelService],
})
export class HiddenModelModule {}
