import { Module } from '@nestjs/common';
import { MiscModelResolver } from './misc-model.resolver';
import { MiscModelService } from './misc-model.service';

@Module({
  providers: [MiscModelService, MiscModelResolver],
})
export class MiscModelModule {}
