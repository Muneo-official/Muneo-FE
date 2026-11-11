'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { type TrialKind } from '@/api/trial';
import * as styles from '@/app/(main)/analysis/page.css';
import { EmptyState } from '@/components/EmptyState/EmptyState';

export const TrialResultUnavailable = ({ kind, expired }: { kind: TrialKind; expired: boolean }) => (
  <div className={styles.page}>
    <EmptyState
      title={expired ? '체험 결과의 보관 시간이 지났어요' : '체험 결과를 불러오지 못했어요'}
      description={
        expired
          ? '체험 결과는 30분 동안만 보관돼요. 지금은 로그인한 상태라 새로 만든 결과를 바로 저장할 수 있어요.'
          : '결과를 만든 브라우저에서 다시 열어 주세요. 계속 안 되면 새로 시작해 주세요.'
      }
    >
      <Button as={Link} href={`/${kind}`} variant="primary" size="md">
        새로 시작하기
      </Button>
    </EmptyState>
  </div>
);
