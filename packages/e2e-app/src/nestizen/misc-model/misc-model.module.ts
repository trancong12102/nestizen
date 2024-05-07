import { MiscModelService } from './misc-model.service';
import { MiscModelResolver } from './misc-model.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [MiscModelService, MiscModelResolver],
  exports: [MiscModelService],
})
export class MiscModelModule {}
