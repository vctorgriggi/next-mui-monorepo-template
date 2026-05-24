'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useOptionalQuery } from '@template/shared/query-helpers';
import { fromResult } from '@template/shared/result';

import {
  createUser,
  deleteUser,
  fetchUserById,
  fetchUsers,
  toggleUserActive,
  updateUser,
} from './actions';
import { userKeys } from './keys';
import type { UserValues } from './validators';

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fromResult(fetchUsers),
  });
}

export function useUser(id: string | null) {
  return useOptionalQuery(id, userKeys.detail, fetchUserById);
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UserValues) => fromResult(() => createUser(input))(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: UserValues }) =>
      fromResult(() => updateUser(vars.id, vars.input))(),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(user.id), user);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fromResult(() => deleteUser(id))(),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fromResult(() => toggleUserActive(id))(),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueryData(userKeys.detail(user.id), user);
    },
  });
}
