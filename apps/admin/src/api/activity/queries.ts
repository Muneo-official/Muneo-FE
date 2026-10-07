import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../request';
import { getUserActivity } from './api';
import { type ActivityKind } from './types';
import { userKeys } from '../users/queries';

export const activityKey = (userId: number, kind: ActivityKind, page: number) =>
  [...userKeys.detail(userId), 'activity', kind, page] as const;

export const useUserActivity = (userId: number, kind: ActivityKind, page: number) =>
  useQuery({
    queryKey: activityKey(userId, kind, page),
    queryFn: ({ signal }) => getUserActivity(userId, kind, page, signal),
    enabled: Number.isSafeInteger(userId) && userId > 0,
    staleTime: 0,
    gcTime: 0,
    retry: (count, error) =>
      count < 1 && error instanceof ApiError && error.status >= 500 && error.code === 'NETWORK_ERROR',
  });
