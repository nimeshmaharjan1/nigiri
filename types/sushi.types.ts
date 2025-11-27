import { z } from 'zod';

// Zod schemas for runtime validation
export const sushiTypeSchema = z.enum(['Nigiri', 'Roll']);

export const sushiSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string(),
  image: z.string(),
  price: z.string(),
  type: sushiTypeSchema,
  pieces: z.number().optional(),
  fishType: z.string().optional(),
});

export const sushiListSchema = z.array(sushiSchema);

// Type inference from schemas
export type T_Sushi = z.infer<typeof sushiSchema>;
export type T_SushiType = z.infer<typeof sushiTypeSchema>;
