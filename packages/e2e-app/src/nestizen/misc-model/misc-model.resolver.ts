import { Resolver } from '@nestjs/graphql';
import { MiscModel } from '../nestizen/graphql-types';
import { MiscModelResolverBase } from './base/misc-model.resolver.base';
import { MiscModelService } from './misc-model.service';

@Resolver(() => MiscModel)
export class MiscModelResolver extends MiscModelResolverBase {
  constructor(public readonly service: MiscModelService) {
    super(service);
  }
}
