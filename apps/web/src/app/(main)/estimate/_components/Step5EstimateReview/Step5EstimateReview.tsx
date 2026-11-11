'use client';

import { ArrowLeftMdIcon, Button } from '@muneo/design-system';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveEstimate } from '@/api/estimate';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { useEstimateStore } from '../../_store/estimateStore';
import { mapToApiPayload } from '../../_utils/mapToApiPayload';
import { EstimateDisclaimer } from '../EstimateDisclaimer/EstimateDisclaimer';
import { EstimateResultView } from '../EstimateResultView/EstimateResultView';

// ─────────── 메인: 가 견적 결과 ───────────

export const EstimateResult = () => {
  const { step1, step2, step3, step4, estimateResult, goToStep, reset } = useEstimateStore();
  const user = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!estimateResult) {
    return null;
  }

  const input = mapToApiPayload(step1, step2, step3, step4);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveEstimate({ input, result: estimateResult }, user.id);
      reset();
      router.push('/home');
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EstimateResultView
      input={input}
      result={estimateResult}
      onEdit={() => goToStep(1)}
      actions={
        <EstimateDisclaimer error={saveError}>
          <Button variant="outlineSecondary" size="md" onClick={() => goToStep(3)}>
            <ArrowLeftMdIcon width={20} height={20} />
            수정하기
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </EstimateDisclaimer>
      }
    />
  );
};
