import { Module } from '@nestjs/common';
import { MiscModelService } from './misc-model.service';
import { MiscModelResolver } from './misc-model.resolver';

@Module({
  providers: [MiscModelService, MiscModelResolver],
})
export class MiscModelModule {}
