export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

export function failure<T>(error: string): Result<T> {
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
