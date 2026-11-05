'use client';

import { Button } from '@muneo/design-system';
import { useEffect, useState } from 'react';
import { type TrialKind } from '@/api/trial';
import * as styles from './TrialLayout.css';

export const TrialLoading = ({ kind, onCancel }: { kind: TrialKind; onCancel: () => void }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <section className={styles.loading} aria-labelledby="trial-loading-title">
      <span className={styles.spinner} aria-hidden="true" />
      <div role="status" aria-live="polite">
        <h1 id="trial-loading-title" className={styles.heading}>
          {kind === 'analysis' ? '견적서를 진단하고 있어요' : '가견적서를 만들고 있어요'}
        </h1>
        <p className={styles.text}>
          {elapsed >= 90
            ? '조금 더 시간이 걸리고 있어요. 완료되면 바로 결과를 보여드릴게요.'
            : '완료되면 결과 일부를 바로 확인할 수 있어요.'}
        </p>
      </div>
      <p className={styles.small} aria-hidden="true">
        {elapsed}초 경과
      </p>
      <p className={styles.small}>로그인은 전체 결과를 확인할 때 하면 돼요.</p>
      <Button variant="outlineSecondary" onClick={onCancel}>
        취소하고 입력으로 돌아가기
      </Button>
    </section>
  );
};
