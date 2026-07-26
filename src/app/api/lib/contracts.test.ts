import { describe, expect, it } from 'vitest';
import { apiErrorSchema, objectIdSchema, paginationSchema, parseObjectId } from './contracts';

describe('API contracts', () => {
  it('accepts valid ObjectIds and rejects malformed identifiers', () => {
    const id = '507f1f77bcf86cd799439011';

    expect(objectIdSchema.parse(id)).toBe(id);
    expect(parseObjectId(id).toString()).toBe(id);
    expect(() => objectIdSchema.parse('not-an-object-id')).toThrow();
  });

  it('enforces bounded pagination and a consistent error envelope', () => {
    expect(paginationSchema.parse({ limit: '10', skip: '2' })).toEqual({ limit: 10, skip: 2 });
    expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
    expect(apiErrorSchema.parse({ isError: true, code: 'INVALID_INPUT', message: 'Invalid request' })).toEqual({
      isError: true,
      code: 'INVALID_INPUT',
      message: 'Invalid request',
    });
  });
});
