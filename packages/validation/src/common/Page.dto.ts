import { z } from 'zod';

export function createPageDtoSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    sort: z.string().optional(),
    order: z.boolean(),
    content: z.array(itemSchema),
  });
}

export type PageDto<T> = {
  total: number;
  page: number;
  limit: number;
  sort?: string;
  order: boolean;
  content: T[];
};
