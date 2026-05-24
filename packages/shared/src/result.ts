/**
 * Either-style return type used by every server action. Carries a typed
 * `data` on success and a plain string `error` on failure — no thrown
 * exceptions cross the wire.
 */
export type Result<T> = Success<T> | Failure;

export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure {
  success: false;
  error: string;
}

export function success<T>(data: T): Success<T> {
  return { success: true, data };
}

/**
 * Returns a generic failure value compatible with any `Result<T>` —
 * callers never need to specify a generic to use it as a return value.
 */
export function failure(error: string): Failure {
  return { success: false, error };
}

/**
 * React Query adapter: turns an action that returns `Result<T>` into a
 * `queryFn` (or `mutationFn`) that throws on failure.
 */
export function fromResult<T>(fn: () => Promise<Result<T>>) {
  return async (): Promise<T> => {
    const result = await fn();
    if (!result.success) throw new Error(result.error);
    return result.data;
  };
}
