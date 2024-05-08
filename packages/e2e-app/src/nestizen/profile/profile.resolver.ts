import { Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { ProfileResolverBase } from './base/profile.resolver.base';
import { Profile } from '../nestizen/graphql-types';

@Resolver(() => Profile)
export class ProfileResolver extends ProfileResolverBase {
  constructor(public readonly service: ProfileService) {
    super(service);
  }
}
