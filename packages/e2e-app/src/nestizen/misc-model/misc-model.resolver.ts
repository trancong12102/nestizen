import { MiscModelBaseResolver } from './base/misc-model.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { MiscModelService } from './misc-model.service';
import { MiscModel } from '../nestizen/graphql-types';

@Resolver(() => MiscModel)
export class MiscModelResolver extends MiscModelBaseResolver {
  constructor(protected readonly service: MiscModelService) {
    super(service);
  }
}
