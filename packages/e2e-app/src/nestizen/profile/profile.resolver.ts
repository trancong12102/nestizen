import { ProfileBaseResolver } from './base/profile.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Profile } from '../nestizen/graphql-types';

@Resolver(() => Profile)
export class ProfileResolver extends ProfileBaseResolver {
  constructor(protected readonly service: ProfileService) {
    super(service);
  }
}
