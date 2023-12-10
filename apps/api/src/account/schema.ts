import { z } from 'zod';

export const schema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export type accountDto = z.infer<typeof schema>;
