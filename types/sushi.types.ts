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

// Create sushi schema with conditional validation
export const createSushiSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    type: sushiTypeSchema,
    price: z
      .string()
      .min(1, 'Price is required')
      .refine((val) => !isNaN(parseFloat(val)), 'Price must be a number')
      .refine((val) => parseFloat(val) > 0, 'Price must be greater than 0'),
    fishType: z.string().optional(),
    pieces: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If type is Nigiri, fishType is required
    if (data.type === 'Nigiri' && !data.fishType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fish type is required for Nigiri',
        path: ['fishType'],
      });
    }

    // If type is Roll, pieces is required
    if (data.type === 'Roll' && !data.pieces) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Number of pieces is required for Roll',
        path: ['pieces'],
      });
    }

    // Validate pieces is a valid number if provided
    if (data.pieces && isNaN(parseInt(data.pieces))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pieces must be a valid number',
        path: ['pieces'],
      });
    }

    // Validate pieces is greater than 0 if provided
    if (data.pieces && parseInt(data.pieces) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pieces must be greater than 0',
        path: ['pieces'],
      });
    }
  });

// Type inference from schemas
export type T_Sushi = z.infer<typeof sushiSchema>;
export type T_SushiType = z.infer<typeof sushiTypeSchema>;
export type T_CreateSushi = z.infer<typeof createSushiSchema>;
