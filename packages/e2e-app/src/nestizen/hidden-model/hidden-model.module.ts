import { Module } from '@nestjs/common';
import { HiddenModelResolver } from './hidden-model.resolver';
import { HiddenModelService } from './hidden-model.service';

@Module({
  providers: [HiddenModelService, HiddenModelResolver],
})
export class HiddenModelModule {}
