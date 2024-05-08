import { Resolver } from '@nestjs/graphql';
import { MiscModelService } from './misc-model.service';
import { MiscModelResolverBase } from './base/misc-model.resolver.base';
import { MiscModel } from '../nestizen/graphql-types';

@Resolver(() => MiscModel)
export class MiscModelResolver extends MiscModelResolverBase {
  constructor(public readonly service: MiscModelService) {
    super(service);
  }
}
