import { HiddenModelBaseResolver } from './base/hidden-model.base.resolver';
import { Resolver } from '@nestjs/graphql';
import { HiddenModelService } from './hidden-model.service';
import { HiddenModel } from '../nestizen/graphql-types';

@Resolver(() => HiddenModel)
export class HiddenModelResolver extends HiddenModelBaseResolver {
  constructor(protected readonly service: HiddenModelService) {
    super(service);
  }
}
