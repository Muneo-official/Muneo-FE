import { afterEach, describe, expect, it, vi } from 'vitest';
import { SERVICE_UNAVAILABLE_EVENT } from '@/lib/serviceAvailability';
import { client } from './client';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('브라우저 API 인증 갱신과 점검 안내', () => {
  it('401이면 갱신한 뒤 원래 POST 본문을 유지해 한 번 재시도한다', async () => {
    const requests: string[] = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (typeof input === 'string' && input.endsWith('/refresh')) {
        return json({});
      }
      const request = input as Request;
      requests.push(await request.clone().text());
      return requests.length === 1 ? json({ code: 'UNAUTHORIZED' }, 401) : json({ ok: true });
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(client.post('api/v1/estimates/save', { json: { test: 1 } }).json()).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(requests).toEqual(['{"test":1}', '{"test":1}']);
  });

  it('동시에 만료된 요청은 갱신을 한 번만 한다', async () => {
    let refreshCalls = 0;
    const counts = new Map<string, number>();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        if (typeof input === 'string' && input.endsWith('/refresh')) {
          refreshCalls++;
          await new Promise((resolve) => setTimeout(resolve, 25));
          return json({});
        }
        const url = (input as Request).url;
        const count = (counts.get(url) ?? 0) + 1;
        counts.set(url, count);
        return count === 1 ? json({}, 401) : json({ ok: true });
      })
    );
    await Promise.all([client.get('api/v1/a').json(), client.get('api/v1/b').json()]);
    expect(refreshCalls).toBe(1);
    expect([...counts.values()]).toEqual([2, 2]);
  });

  it('로그인 실패 401은 토큰 갱신 없이 원래 오류를 전달한다', async () => {
    const fetchMock = vi.fn(async () => json({ code: 'INVALID_LOGIN_INFO' }, 401));
    vi.stubGlobal('fetch', fetchMock);
    await expect(client.post('api/v1/users/login', { json: {} }).json()).rejects.toMatchObject({
      status: 401,
      body: { code: 'INVALID_LOGIN_INFO' },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('503은 쓰기 요청을 반복하지 않고 점검 안내를 알린다', async () => {
    const notify = vi.fn();
    window.addEventListener(SERVICE_UNAVAILABLE_EVENT, notify);
    const fetchMock = vi.fn(async () => json({}, 503));
    vi.stubGlobal('fetch', fetchMock);
    await expect(client.post('api/v1/estimates/save', { json: {} })).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
    window.removeEventListener(SERVICE_UNAVAILABLE_EVENT, notify);
  });
});
