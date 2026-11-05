'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { type TrialKind } from '@/api/trial';
import * as styles from '@/app/(landing)/try/_components/TrialLayout.css';

export const TrialResultUnavailable = ({ kind, expired }: { kind: TrialKind; expired: boolean }) => (
  <section className={styles.page}>
    <h1 className={styles.heading}>{expired ? '체험 결과의 보관 시간이 지났어요' : '체험 결과를 불러오지 못했어요'}</h1>
    <p className={styles.text}>
      {expired
        ? '임시 결과는 완료 후 30분 동안 보관돼요. 다시 체험하거나 로그인한 상태에서 새로 시작해 주세요.'
        : '결과를 만든 브라우저와 계정인지 확인하고 다시 시도해 주세요.'}
    </p>
    <div className={styles.actions}>
      <Button as={Link} href={`/try/${kind}`} variant="primary">
        다시 체험하기
      </Button>
      <Link href={`/${kind}`}>로그인 상태로 새로 시작</Link>
    </div>
  </section>
);
