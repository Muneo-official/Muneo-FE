'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { type TrialKind } from '@/api/trial';
import * as styles from '@/app/(main)/analysis/page.css';

export const TrialResultUnavailable = ({ kind, expired }: { kind: TrialKind; expired: boolean }) => (
  <div className={styles.page}>
    <section className={styles.content}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {expired ? '체험 결과의 보관 시간이 지났어요' : '체험 결과를 불러오지 못했어요'}
        </h1>
        <p className={styles.pageSubtitle}>
          {expired
            ? '임시 결과는 완료 후 30분 동안 보관돼요. 로그인한 상태로 새로 시작하면 결과를 바로 저장할 수 있어요.'
            : '결과를 만든 브라우저와 계정인지 확인하고 다시 시도해 주세요.'}
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <Button as={Link} href={`/${kind}`} variant="primary" size="md">
          새로 시작하기
        </Button>
        <Button as={Link} href={`/try/${kind}`} variant="outlineSecondary" size="md">
          다시 체험하기
        </Button>
      </div>
    </section>
  </div>
);
