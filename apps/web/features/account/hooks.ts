'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fromResult } from '@template/shared/result';

import { fetchMyAccount, updateMyAccount } from './actions';
import { accountKeys } from './keys';
import type { AccountValues } from './validators';

export function useMyAccount() {
  return useQuery({
    queryKey: accountKeys.all,
    queryFn: fromResult(fetchMyAccount),
  });
}

export function useUpdateMyAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AccountValues) =>
      fromResult(() => updateMyAccount(input))(),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.all, account);
    },
  });
}
