import { UserBaseResolver } from './base/user.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../nestizen/graphql-types';

@Resolver(() => User)
export class UserResolver extends UserBaseResolver {
  constructor(protected readonly service: UserService) {
    super(service);
  }
}
