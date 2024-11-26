import { Resolver } from '@nestjs/graphql';
import { User } from '../nestizen/graphql-types';
import { UserResolverBase } from './base/user.resolver.base';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver extends UserResolverBase {
  constructor(public readonly service: UserService) {
    super(service);
  }
}
