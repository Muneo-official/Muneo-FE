import { type NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/api/baseUrl';

export const maxDuration = 300;

const getForwardUrl = (path: string[], search: string) => {
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join('/');
  return `${getApiBaseUrl()}/api/${encodedPath}${search}`;
};

const getForwardHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);

  headers.delete('host');
  headers.delete('content-length');
  headers.delete('connection');
  headers.delete('accept-encoding');
  headers.delete('origin');
  headers.delete('referer');
  headers.delete('forwarded');

  for (const key of [...headers.keys()]) {
    if (key.startsWith('sec-') || key.startsWith('x-forwarded-') || key.startsWith('x-real-')) {
      headers.delete(key);
    }
  }

  return headers;
};

const isHttpLocalRequest = (request: NextRequest) => {
  const { hostname, protocol } = request.nextUrl;
  return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1');
};

const rewriteSetCookieForLocal = (setCookie: string, stripSecure: boolean) => {
  const [nameValue, ...attributes] = setCookie.split(';');
  const rewrittenAttributes = attributes
    .map((attribute) => attribute.trim())
    .filter((attribute) => attribute && !attribute.toLowerCase().startsWith('domain='))
    .filter((attribute) => !(stripSecure && attribute.toLowerCase() === 'secure'))
    .map((attribute) => (stripSecure && attribute.toLowerCase() === 'samesite=none' ? 'SameSite=Lax' : attribute));

  return [nameValue, ...rewrittenAttributes].join('; ');
};

const getSetCookies = (headers: Headers) => {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const setCookies = getSetCookie?.call(headers);
  if (setCookies?.length) {
    return setCookies;
  }

  const setCookie = headers.get('set-cookie');
  if (!setCookie) {
    return [];
  }

  return setCookie.split(/,(?=\s*[^;,=\s]+=)/);
};

const appendSetCookies = (request: NextRequest, response: NextResponse, upstream: Response) => {
  const setCookies = getSetCookies(upstream.headers);
  const stripSecure = isHttpLocalRequest(request);

  for (const setCookie of setCookies) {
    response.headers.append('Set-Cookie', rewriteSetCookieForLocal(setCookie, stripSecure));
  }
};

const proxy = async (request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) => {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.json(
      { code: 'MAINTENANCE', message: '서비스 점검 중입니다.' },
      { status: 503, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } }
    );
  }
  const { path } = await params;
  const method = request.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  let upstream: Response;
  try {
    upstream = await fetch(getForwardUrl(path, request.nextUrl.search), {
      method,
      headers: getForwardHeaders(request),
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(240000)]),
    });
  } catch (e) {
    console.error('[api proxy] upstream fetch failed', e);
    return NextResponse.json({ code: 'BAD_GATEWAY', message: '업스트림 API 호출에 실패했습니다.' }, { status: 502 });
  }

  const headers = new Headers(upstream.headers);
  headers.delete('set-cookie');
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('transfer-encoding');

  const response = new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });

  appendSetCookies(request, response, upstream);

  return response;
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
