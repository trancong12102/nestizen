import { Module } from '@nestjs/common';
import { HiddenModelService } from './hidden-model.service';
import { HiddenModelResolver } from './hidden-model.resolver';

@Module({
  providers: [HiddenModelService, HiddenModelResolver],
})
export class HiddenModelModule {}
