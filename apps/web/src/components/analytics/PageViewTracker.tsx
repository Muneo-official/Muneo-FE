'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getPageLocation, trackEvent } from '@/lib/analytics';

// 클라이언트 라우팅은 GA4가 스스로 감지하지 않으므로(GTM의 Google 태그에서 자동 page_view를 끈다) 화면 전환마다 직접 보낸다.
export const PageViewTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousLocation = useRef<string | null>(null);

  useEffect(() => {
    trackEvent('page_view', {
      page_title: document.title,
      // 첫 진입은 GA4가 document.referrer(외부 유입처)를 쓰도록 비워 두고, 이후 전환부터 직전 화면을 넘긴다.
      page_referrer: previousLocation.current ?? undefined,
    });
    previousLocation.current = getPageLocation();
  }, [pathname, searchParams]);

  return null;
};
