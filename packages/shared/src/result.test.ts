import { describe, expect, it } from 'vitest';

import { failure, fromResult, success } from './result';

describe('success', () => {
  it('wraps data in a { success: true } shape', () => {
    expect(success(42)).toEqual({ success: true, data: 42 });
  });

  it('preserves object identity in the data field', () => {
    const payload = { id: 'u1', name: 'Ana' };
    expect(success(payload).data).toBe(payload);
  });
});

describe('failure', () => {
  it('wraps an error message in a { success: false } shape', () => {
    expect(failure('not found')).toEqual({
      success: false,
      error: 'not found',
    });
  });

  it('returns a value assignable to any Result<T> (compile-time, sanity-check at runtime)', () => {
    // If this function compiles, `Failure` is assignable to `Result<unknown>`.
    function consume(
      _r: ReturnType<typeof success<number>> | ReturnType<typeof failure>,
    ) {}
    consume(failure('boom'));
    consume(success(1));
  });
});

describe('fromResult', () => {
  it('returns data when the underlying action succeeds', async () => {
    const fn = fromResult(async () => success('ok'));
    await expect(fn()).resolves.toBe('ok');
  });

  it('throws an Error with the failure message', async () => {
    const fn = fromResult(async () => failure('boom'));
    await expect(fn()).rejects.toThrow('boom');
  });
});
