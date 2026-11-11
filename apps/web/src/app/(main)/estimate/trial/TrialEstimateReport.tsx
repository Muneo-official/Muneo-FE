'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { saveEstimate } from '@/api/estimate';
import { type FullEstimateTrial } from '@/api/trial';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { unlockReveal } from '@/components/Locked/Locked.css';
import { TrialUnlockedNotice } from '@/components/TrialUnlockedNotice';
import { EstimateDisclaimer } from '../_components/EstimateDisclaimer/EstimateDisclaimer';
import { EstimateResultView } from '../_components/EstimateResultView/EstimateResultView';
import { useEstimateStore } from '../_store/estimateStore';

export const TrialEstimateReport = ({ trial }: { trial: FullEstimateTrial }) => {
  const user = useUser();
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 체험 입력이 같은 스토어에 4단계로 남아 있으면 /estimate 진입 시 가견적을 다시 생성하므로 비운다.
  useEffect(() => {
    useEstimateStore.getState().reset();
  }, []);

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
    <>
      <TrialUnlockedNotice />
      <div className={unlockReveal} style={{ width: '100%' }}>
        <EstimateResultView
          input={trial.input}
          result={trial.result}
          actions={
            <EstimateDisclaimer error={error} notice={saved ? <p role="status">분석 이력에 저장했어요.</p> : null}>
              <Button as={Link} href="/estimate" variant="outlineSecondary" size="md">
                새 가견적 만들기
              </Button>
              {saved ? (
                <Button as={Link} href="/history" variant="primary" size="md">
                  저장한 결과 보기
                </Button>
              ) : (
                <Button onClick={save} disabled={busy} variant="primary" size="md">
                  {busy ? '저장 중…' : '내 분석 이력에 저장'}
                </Button>
              )}
            </EstimateDisclaimer>
          }
        />
      </div>
    </>
  );
};
