import 'server-only';
import { cookies } from 'next/headers';
import { getApiBaseUrl } from './baseUrl';
import { toApiError } from './errors';

interface ServerFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export const serverFetch = async <T>(path: string, options: ServerFetchOptions = {}): Promise<T> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { body, headers: customHeaders, ...rest } = options;

  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }
  if (customHeaders) {
    new Headers(customHeaders).forEach((value, key) => headers.set(key, value));
  }

  const res = await fetch(`${getApiBaseUrl()}/${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    // 4xx는 호출부에서 폴백/리다이렉트로 처리하는 예상된 흐름이라 warn, 5xx만 error로 남긴다.
    const logRequestFailure = res.status >= 500 ? console.error : console.warn;
    logRequestFailure('[serverFetch] request failed', {
      url: `${getApiBaseUrl()}/${path}`,
      status: res.status,
      body: errorBody,
    });
    const err = new Error(`API Error: ${res.status}`);
    Object.assign(err, { status: res.status, body: errorBody });
    throw toApiError(err);
  }

  return res.json() as Promise<T>;
};
