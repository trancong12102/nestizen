import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Module } from '@nestjs/common';

@Module({
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
