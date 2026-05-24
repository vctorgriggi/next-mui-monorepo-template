import { describe, expect, it } from 'vitest';

import { createQueryKeys } from './query-keys';

describe('createQueryKeys', () => {
  const userKeys = createQueryKeys('users');

  it('exposes a root key under `all`', () => {
    expect(userKeys.all).toEqual(['users']);
  });

  it('builds list keys via `lists()`', () => {
    expect(userKeys.lists()).toEqual(['users', 'list']);
  });

  it('builds detail keys via `detail(id)`', () => {
    expect(userKeys.detail('42')).toEqual(['users', 'detail', '42']);
  });

  it('produces independent keys per domain', () => {
    const orderKeys = createQueryKeys('orders');
    expect(orderKeys.all).toEqual(['orders']);
    expect(orderKeys.detail('99')).toEqual(['orders', 'detail', '99']);
    expect(orderKeys.all).not.toEqual(userKeys.all);
  });
});
