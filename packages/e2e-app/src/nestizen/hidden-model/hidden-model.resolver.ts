import { Resolver } from '@nestjs/graphql';
import { HiddenModelService } from './hidden-model.service';
import { HiddenModelResolverBase } from './base/hidden-model.resolver.base';
import { HiddenModel } from '../nestizen/graphql-types';

@Resolver(() => HiddenModel)
export class HiddenModelResolver extends HiddenModelResolverBase {
  constructor(public readonly service: HiddenModelService) {
    super(service);
  }
}
