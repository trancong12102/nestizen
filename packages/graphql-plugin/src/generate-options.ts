import { z } from 'zod';

export const GenerateOptionsSchema = z.object({
  output: z.string(),
});

export type GenerateOptions = z.infer<typeof GenerateOptionsSchema>;
