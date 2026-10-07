import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { changeUserRole, deleteUser, getUser, getUsers, restoreUser, updateUser } from './api';
import { type ChangeRoleRequest, type UpdateUserRequest, type UserListParams } from './types';

export const userKeys = {
  all: ['admin-users'] as const,
  list: (params: UserListParams) => [...userKeys.all, 'list', params] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

export const useUsersQuery = (params: UserListParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });

export const useUserQuery = (userId: number) =>
  useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId),
    enabled: Number.isSafeInteger(userId) && userId > 0,
  });

const invalidate = (qc: ReturnType<typeof useQueryClient>) => qc.invalidateQueries({ queryKey: userKeys.all });

export const useUpdateUser = (userId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(userId, data),
    onSuccess: () => invalidate(qc),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => invalidate(qc),
  });
};

export const useRestoreUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => restoreUser(userId),
    onSuccess: () => invalidate(qc),
  });
};

export const useChangeUserRole = (userId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeRoleRequest) => changeUserRole(userId, data),
    onSuccess: () => invalidate(qc),
  });
};
