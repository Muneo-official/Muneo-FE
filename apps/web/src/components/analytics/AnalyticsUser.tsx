'use client';

import { useEffect } from 'react';
import { setAnalyticsUser, trackPendingSocialLogin } from '@/lib/analytics';
import { type AuthUser } from '@/types/auth';

type Props = Pick<AuthUser, 'id' | 'authProvider' | 'role'>;

// 루트 레이아웃의 PageViewTracker보다 먼저 이펙트가 돌도록 (main) 레이아웃에 둔다. 그래야 로그인 후 첫 page_view부터 user_id가 붙는다.
export const AnalyticsUser = ({ id, authProvider, role }: Props) => {
  useEffect(() => {
    setAnalyticsUser({ id, authProvider, role });
    trackPendingSocialLogin();
  }, [id, authProvider, role]);

  return null;
};
