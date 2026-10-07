import { client } from '../client';
import { ApiError, requestResult, requestVoid } from '../request';
import { type LoginRequest, type User } from './types';

const requireAdmin = (user: User) => {
  if (!user || user.role !== 'ADMIN') {
    throw new ApiError('관리자 계정으로 로그인해 주세요.', 403, 'ADMIN_REQUIRED');
  }
  return user;
};

export const login = async (data: LoginRequest) =>
  requireAdmin(await requestResult<User>(client.post('/api/v1/admin/login', data)));

export const getAdminSession = async (expectedId: number, signal?: AbortSignal) => {
  const user = requireAdmin(await requestResult<User>(client.get('/api/v1/users/me', { signal })));
  if (user.id !== expectedId) {
    throw new ApiError('로그인 계정이 변경되었습니다. 다시 로그인해 주세요.', 403, 'ADMIN_SESSION_CHANGED');
  }
  return user;
};

export const logout = () => requestVoid(client.post('/api/v1/users/logout'));
