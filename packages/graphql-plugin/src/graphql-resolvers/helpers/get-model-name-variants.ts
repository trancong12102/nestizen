import camelcase from '@stdlib/string-camelcase';
import kebabcase from '@stdlib/string-kebabcase';
import { ModelNameVariants } from '../types/model-name-variants';

export const getModelNameVariants = (name: string): ModelNameVariants => ({
  original: name,
  camelCase: camelcase(name),
  kebab: kebabcase(name),
});
