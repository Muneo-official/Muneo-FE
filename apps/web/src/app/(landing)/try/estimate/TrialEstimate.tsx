'use client';

import { Button } from '@muneo/design-system';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { generateTrialEstimate } from '@/api/trial';
import { Step1BasicInfo } from '@/app/(main)/estimate/_components/Step1BasicInfo/Step1BasicInfo';
import { StepIndicator } from '@/app/(main)/estimate/_components/StepIndicator/StepIndicator';
import { useEstimateStore } from '@/app/(main)/estimate/_store/estimateStore';
import { mapToApiPayload } from '@/app/(main)/estimate/_utils/mapToApiPayload';
import * as styles from '../_components/TrialLayout.css';
import { TrialLoading } from '../_components/TrialLoading';
import { TrialRestore } from '../_components/TrialRestore';
import { useTrialSession } from '../_hooks/useTrialSession';

const Preview = dynamic(() => import('../_components/TrialPreview').then((m) => m.TrialPreview), {
  loading: () => <p role="status">결과를 표시하고 있어요.</p>,
});
const Step2ProcessSelection = dynamic(
  () =>
    import('@/app/(main)/estimate/_components/Step2ProcessSelection/Step2ProcessSelection').then(
      (m) => m.Step2ProcessSelection
    ),
  { loading: () => <p role="status">공정 선택 화면을 준비하고 있어요.</p> }
);
const Step3ConstructionConditions = dynamic(
  () =>
    import('@/app/(main)/estimate/_components/Step3ConstructionConditions/Step3ConstructionConditions').then(
      (m) => m.Step3ConstructionConditions
    ),
  { loading: () => <p role="status">공사 조건 화면을 준비하고 있어요.</p> }
);
export const TrialEstimate = () => {
  const { preview, loading, restoring, error, run, cancel, edit } = useTrialSession('estimate');
  const step = useEstimateStore((s) => s.currentStep);
  const goToStep = useEstimateStore((s) => s.goToStep);
  const entered = useRef(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);
  useEffect(() => {
    if (step !== 4) {
      entered.current = true;
      return;
    }
    if (!entered.current) {
      goToStep(1);
      return;
    }
    if (restoring || preview || loading || error) {
      return;
    }
    const { step1, step2, step3, step4 } = useEstimateStore.getState();
    void import('../_components/TrialPreview');
    void run((signal) => generateTrialEstimate(mapToApiPayload(step1, step2, step3, step4), signal));
  }, [step, restoring, preview, loading, error, goToStep, run]);
  const editInput = () => {
    cancel();
    edit();
    goToStep(1);
  };
  const cancelGeneration = () => {
    cancel();
    goToStep(3);
  };
  const Step = step === 1 ? Step1BasicInfo : step === 2 ? Step2ProcessSelection : Step3ConstructionConditions;
  const preloadNext = () => {
    if (step === 1) {
      void import('@/app/(main)/estimate/_components/Step2ProcessSelection/Step2ProcessSelection');
    }
    if (step === 2) {
      void import('@/app/(main)/estimate/_components/Step3ConstructionConditions/Step3ConstructionConditions');
    }
  };
  return (
    <main className={styles.page}>
      {restoring ? (
        <TrialRestore />
      ) : loading || (step === 4 && !preview && !error) ? (
        <TrialLoading kind="estimate" onCancel={cancelGeneration} />
      ) : preview ? (
        <Preview preview={preview} onEdit={editInput} />
      ) : (
        <>
          <header className={styles.header}>
            <p className={styles.eyebrow}>로그인 없이 먼저 체험</p>
            <h1 className={styles.heading}>우리 집 가견적부터 만들어 보세요</h1>
            <p className={styles.text}>
              공사 조건을 입력하면 한 공정의 예상 비용을 먼저 확인할 수 있어요. 전체 가견적은 로그인 후 이어서 볼 수
              있어요.
            </p>
          </header>
          <StepIndicator currentStep={step} />
          {error && (
            <div role="alert" className={styles.error}>
              {error}
              <Button variant="outlineSecondary" onClick={cancelGeneration}>
                입력으로 돌아가기
              </Button>
            </div>
          )}
          <div onFocusCapture={preloadNext}>
            <Step />
          </div>
        </>
      )}
    </main>
  );
};
