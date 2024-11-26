import { Resolver } from '@nestjs/graphql';
import { HiddenModel } from '../nestizen/graphql-types';
import { HiddenModelResolverBase } from './base/hidden-model.resolver.base';
import { HiddenModelService } from './hidden-model.service';

@Resolver(() => HiddenModel)
export class HiddenModelResolver extends HiddenModelResolverBase {
  constructor(public readonly service: HiddenModelService) {
    super(service);
  }
}
