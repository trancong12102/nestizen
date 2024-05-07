import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
