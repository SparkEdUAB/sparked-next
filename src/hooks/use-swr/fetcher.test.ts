import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetcher } from './fetcher';

vi.mock('utils/helpers/getProcessCodeMeaning', () => ({
  default: (code: number) => `meaning_${code}`,
}));

describe('fetcher', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on success', async () => {
    const data = { id: 1, name: 'Test' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    } as Response);

    const result = await fetcher('/api/test');
    expect(result).toEqual(data);
  });

  it('returns Error when res.ok is false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ code: 404 }),
    } as Response);

    const result = await fetcher('/api/test');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain('meaning_404');
  });

  it('returns Error when response has isError: true', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ isError: true, code: 500 }),
    } as Response);

    const result = await fetcher('/api/test');
    expect(result).toBeInstanceOf(Error);
  });

  it('returns Error on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await fetcher('/api/test');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain('Failed to fetch');
  });
});
