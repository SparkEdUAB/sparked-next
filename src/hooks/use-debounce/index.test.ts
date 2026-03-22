import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounceValue from './index';

describe('useDebounceValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounceValue('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('does not update before delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    });

    rerender({ value: 'world', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('hello');
  });

  it('updates after delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    });

    rerender({ value: 'world', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounceValue(value, delay), {
      initialProps: { value: 'a', delay: 500 },
    });

    rerender({ value: 'b', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: 'c', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Only 300ms since last change, should still be 'a'
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('c');
  });
});
