import { GeneratorKeyword } from '../types/generator-keyword';

export const t = <T>(...value: GeneratorKeyword[]) =>
  (value.length === 1 ? value[0] : value) as T;
