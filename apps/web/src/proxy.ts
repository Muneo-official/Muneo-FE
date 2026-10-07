import { NextResponse, type NextRequest } from 'next/server';
import { getLoginHref } from '@/lib/authRedirect';

const PROTECTED_PREFIXES = ['/home', '/estimate', '/analysis', '/history', '/profile'];

const getApiBase = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  }
  return apiBase;
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  const returnTo = pathname + request.nextUrl.search;
  const maintenanceUrl = new URL(`/maintenance?next=${encodeURIComponent(returnTo)}`, request.url);
  if (process.env.MAINTENANCE_MODE === 'true') {
    return NextResponse.redirect(maintenanceUrl);
  }

  const accessToken = request.cookies.get('access_token')?.value;
  if (accessToken) {
    return NextResponse.next();
  }

  let refreshRes: Response;
  try {
    const apiBase = getApiBase();
    refreshRes = await fetch(`${apiBase}/api/v1/users/refresh`, {
      method: 'POST',
      headers: { Cookie: request.headers.get('cookie') ?? '' },
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return NextResponse.redirect(maintenanceUrl);
  }

  if (refreshRes.status >= 500) {
    return NextResponse.redirect(maintenanceUrl);
  }

  if (!refreshRes.ok) {
    return NextResponse.redirect(new URL(getLoginHref(returnTo), request.url));
  }

  const response = NextResponse.next();
  for (const cookie of refreshRes.headers.getSetCookie()) {
    response.headers.append('Set-Cookie', cookie);
  }
  return response;
};

export const config = {
  matcher: ['/home/:path*', '/estimate/:path*', '/analysis/:path*', '/history/:path*', '/profile/:path*'],
};
