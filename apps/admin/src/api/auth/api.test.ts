import { afterEach, describe, expect, it, vi } from 'vitest';
import { qaAdmin } from '../../../qa/fixtures';
import { client } from '../client';
import { getAdminSession, login, logout } from './api';

afterEach(() => vi.restoreAllMocks());

describe('관리자 세션 확인', () => {
  it('서버가 확인한 관리자만 허용한다', async () => {
    vi.spyOn(client, 'get').mockResolvedValue({ data: { success: true, result: qaAdmin } });
    expect(await getAdminSession(900)).toEqual(qaAdmin);
  });
  it('일반 사용자 세션을 거부한다', async () => {
    vi.spyOn(client, 'get').mockResolvedValue({ data: { success: true, result: { ...qaAdmin, role: 'USER' } } });
    await expect(getAdminSession(900)).rejects.toMatchObject({ status: 403, code: 'ADMIN_REQUIRED' });
  });
  it('다른 탭에서 쿠키 계정이 바뀐 경우 다시 로그인하도록 한다', async () => {
    vi.spyOn(client, 'get').mockResolvedValue({ data: { success: true, result: { ...qaAdmin, id: 901 } } });
    await expect(getAdminSession(900)).rejects.toMatchObject({ code: 'ADMIN_SESSION_CHANGED' });
  });
  it('로그인 응답이 일반 사용자이면 관리자 상태로 저장하지 않는다', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({ data: { success: true, result: { ...qaAdmin, role: 'USER' } } });
    await expect(login({ email: 'user@example.test', password: 'example' })).rejects.toMatchObject({ status: 403 });
  });
  it('로그아웃은 서버의 쿠키 폐기 API를 호출한다', async () => {
    const post = vi.spyOn(client, 'post').mockResolvedValue({ data: { success: true, result: null } });
    await logout();
    expect(post).toHaveBeenCalledWith('/api/v1/users/logout');
  });
});
