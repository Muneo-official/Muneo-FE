'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { saveEstimate } from '@/api/estimate';
import { type FullEstimateTrial } from '@/api/trial';
import * as styles from '@/app/(landing)/try/_components/TrialLayout.css';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { EstimateResultView } from '../_components/EstimateResultView/EstimateResultView';

export const TrialEstimateReport = ({ trial }: { trial: FullEstimateTrial }) => {
  const user = useUser();
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const save = async () => {
    if (saving.current || saved) {
      return;
    }
    saving.current = true;
    setBusy(true);
    setError(null);
    try {
      await saveEstimate(trial, user.id);
      setSaved(true);
    } catch {
      setError('저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  return (
    <EstimateResultView
      input={trial.input}
      result={trial.result}
      actions={
        <div>
          <p className={styles.small}>
            현장 상태에 따라 금액이 달라질 수 있어요. 최종 공사 범위와 부가세 포함 여부는 업체와 확인해 주세요.
          </p>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <div className={styles.actions}>
            {saved ? (
              <>
                <p role="status">분석 이력에 저장했어요.</p>
                <Button as={Link} href="/history" variant="primary">
                  저장한 결과 보기
                </Button>
              </>
            ) : (
              <Button onClick={save} disabled={busy} variant="primary">
                {busy ? '저장 중…' : '내 분석 이력에 저장'}
              </Button>
            )}
            <Link href="/estimate">새 가견적 만들기</Link>
          </div>
        </div>
      }
    />
  );
};
