import { z } from 'zod';

export const GenerateOptionsSchema = z.object({
  output: z.string(),
  prismaClientPath: z.string().default('@prisma/client'),
  prismaServicePath: z.string(),
  prismaServiceName: z.string(),
});

export type GenerateOptions = z.infer<typeof GenerateOptionsSchema>;
