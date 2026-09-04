'use client';

import { Button, TriangleWarningIcon } from '@muneo/design-system';
import { useEffect } from 'react';
import { isApiError } from '@/api/errors';

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * (main) 하위 라우트 전용 에러 폴백. src/app/error.tsx 와 달리 SidebarShell 레이아웃을
 * 유지한 채 페이지 영역만 대체한다.
 */
export const RouteError = ({ error, reset }: RouteErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const description = isApiError(error) ? error.message : '일시적인 문제가 발생했습니다. 다시 시도해주세요.';

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <TriangleWarningIcon width={48} height={48} style={{ color: '#EF4444' }} />
      <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>불러오지 못했습니다</h2>
      <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{description}</p>
      <Button variant="primary" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
};
