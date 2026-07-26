import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Expected a 24-character MongoDB ObjectId.');

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  skip: z.coerce.number().int().min(0).default(0),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const apiErrorSchema = z.object({
  isError: z.literal(true),
  code: z.string(),
  message: z.string().optional(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export function parseObjectId(value: string) {
  return new ObjectId(objectIdSchema.parse(value));
}

export function errorResponse(error: ApiError, status: number) {
  return new Response(JSON.stringify(apiErrorSchema.parse(error)), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
