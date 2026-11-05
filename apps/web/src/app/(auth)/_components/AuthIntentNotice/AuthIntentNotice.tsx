'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getSafeReturnPath } from '@/lib/authRedirect';
import * as styles from './AuthIntentNotice.css';

const Notice = ({ mode }: { mode: 'login' | 'signup' }) => {
  const params = useSearchParams();
  const path = getSafeReturnPath(params.get('next'));
  const feature = path.startsWith('/analysis')
    ? '견적서 리스크 진단'
    : path.startsWith('/estimate')
      ? '가견적서 생성'
      : null;
  const trial = path.endsWith('/trial');

  return (
    <div className={styles.notice}>
      <p className={styles.title}>
        {trial
          ? '방금 확인한 결과를 이어서 보세요'
          : mode === 'signup'
            ? '무료 가입으로 시작하세요'
            : '로그인하고 이어서 시작하세요'}
      </p>
      <p>
        {trial
          ? '입력과 분석을 다시 하지 않아도 전체 결과를 바로 확인할 수 있어요.'
          : feature
            ? `${mode === 'signup' ? '가입' : '로그인'} 후 ${feature} 화면으로 바로 연결돼요.`
            : '가견적서 생성과 견적서 진단을 이용할 수 있어요.'}
      </p>
      {mode === 'signup' && <p>저장한 결과는 내 분석 이력에서 다시 확인하세요.</p>}
    </div>
  );
};

export const AuthIntentNotice = ({ mode }: { mode: 'login' | 'signup' }) => (
  <Suspense fallback={null}>
    <Notice mode={mode} />
  </Suspense>
);
