import { Resolver } from '@nestjs/graphql';
import { Profile } from '../nestizen/graphql-types';
import { ProfileResolverBase } from './base/profile.resolver.base';
import { ProfileService } from './profile.service';

@Resolver(() => Profile)
export class ProfileResolver extends ProfileResolverBase {
  constructor(public readonly service: ProfileService) {
    super(service);
  }
}
