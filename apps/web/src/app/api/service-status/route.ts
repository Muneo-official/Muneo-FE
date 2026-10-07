import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/api/baseUrl';

export const dynamic = 'force-dynamic';

export async function GET() {
  let available = false;
  if (process.env.MAINTENANCE_MODE !== 'true') {
    try {
      // 공개 헬스 API가 확정되기 전에는 무인증 /me의 200·401을 서버 도달 여부로만 확인한다.
      const response = await fetch(`${getApiBaseUrl()}/api/v1/users/me`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
        redirect: 'manual',
      });
      available = response.ok || response.status === 401;
    } catch {
      available = false;
    }
  }
  return NextResponse.json(
    { available },
    {
      status: available ? 200 : 503,
      headers: { 'Cache-Control': 'no-store', ...(available ? {} : { 'Retry-After': '60' }) },
    }
  );
}
