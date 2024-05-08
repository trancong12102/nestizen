import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResolverBase } from './base/user.resolver.base';
import { User } from '../nestizen/graphql-types';

@Resolver(() => User)
export class UserResolver extends UserResolverBase {
  constructor(public readonly service: UserService) {
    super(service);
  }
}
