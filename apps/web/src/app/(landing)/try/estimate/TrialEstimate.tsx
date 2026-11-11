'use client';

import { ArrowLeftMdIcon, Button } from '@muneo/design-system';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { type EstimatePreview, generateTrialEstimate } from '@/api/trial';
import { EstimateDisclaimer } from '@/app/(main)/estimate/_components/EstimateDisclaimer/EstimateDisclaimer';
import { EstimateLoadingScreen } from '@/app/(main)/estimate/_components/EstimateLoadingScreen/EstimateLoadingScreen';
import { EstimateResultView } from '@/app/(main)/estimate/_components/EstimateResultView/EstimateResultView';
import { Step1BasicInfo } from '@/app/(main)/estimate/_components/Step1BasicInfo/Step1BasicInfo';
import { Step2ProcessSelection } from '@/app/(main)/estimate/_components/Step2ProcessSelection/Step2ProcessSelection';
import { Step3ConstructionConditions } from '@/app/(main)/estimate/_components/Step3ConstructionConditions/Step3ConstructionConditions';
import { StepIndicator } from '@/app/(main)/estimate/_components/StepIndicator/StepIndicator';
import { useEstimateStore } from '@/app/(main)/estimate/_store/estimateStore';
import { mapToApiPayload } from '@/app/(main)/estimate/_utils/mapToApiPayload';
import * as pageStyles from '@/app/(main)/estimate/page.css';
import { PendingLinkLabel } from '@/components/PendingLinkLabel';
import { getLoginHref, getSignupHref } from '@/lib/authRedirect';
import { useTrialResultPath } from '../_components/GuestShell';
import { TrialNotice } from '../_components/TrialNotice';
import { TrialUnlockNote } from '../_components/TrialUnlockNote';
import { useTrialSession } from '../_hooks/useTrialSession';

const RESULT_PATH = '/estimate/trial';
const INPUT_STEPS = { 1: Step1BasicInfo, 2: Step2ProcessSelection, 3: Step3ConstructionConditions } as const;
type InputStep = keyof typeof INPUT_STEPS;

const TrialEstimateResult = ({ preview, onEdit }: { preview: EstimatePreview; onEdit: (step: InputStep) => void }) => {
  const loginHref = getLoginHref(RESULT_PATH);
  const lockedCount = preview.lockedProcesses.length;
  return (
    <EstimateResultView
      input={preview.input}
      result={preview.result}
      lock={{ lockedProcesses: preview.lockedProcesses, loginHref }}
      onEdit={() => onEdit(1)}
      actions={
        <EstimateDisclaimer
          notice={
            <TrialUnlockNote
              title={
                lockedCount > 0 ? `나머지 ${lockedCount}개 공정과 총 견적이 잠겨 있어요` : '총 견적 범위가 잠겨 있어요'
              }
              signupHref={getSignupHref(RESULT_PATH)}
            />
          }
        >
          <Button variant="outlineSecondary" size="md" onClick={() => onEdit(3)}>
            <ArrowLeftMdIcon width={20} height={20} />
            수정하기
          </Button>
          <Button as={Link} href={loginHref} variant="gradient" size="md">
            <PendingLinkLabel>로그인하고 전체 결과 보기</PendingLinkLabel>
          </Button>
        </EstimateDisclaimer>
      }
    />
  );
};

export const TrialEstimate = () => {
  const { preview, restoring, error, run, cancel, edit } = useTrialSession('estimate');
  const step = useEstimateStore((s) => s.currentStep);
  const region = useEstimateStore((s) => s.step1.region);
  const processCount = useEstimateStore((s) => s.step2.selectedProcesses.length);
  const goToStep = useEstimateStore((s) => s.goToStep);
  const entered = useRef(false);
  const result = preview?.kind === 'estimate' ? preview : null;
  useTrialResultPath(result ? RESULT_PATH : null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, result]);

  useEffect(() => {
    if (step !== 4) {
      entered.current = true;
      return;
    }
    // 이전 방문에서 4단계로 남은 상태로 들어오면 입력부터 다시 시작한다.
    if (!entered.current) {
      goToStep(1);
      return;
    }
    if (restoring || preview || error) {
      return;
    }
    const { step1, step2, step3, step4 } = useEstimateStore.getState();
    void run((signal) => generateTrialEstimate(mapToApiPayload(step1, step2, step3, step4), signal));
  }, [step, restoring, preview, error, goToStep, run]);

  const backToInput = (target: InputStep) => {
    cancel();
    edit();
    // 새로고침으로 결과만 복원된 경우에는 입력이 비어 있으므로 처음 단계로 보낸다.
    goToStep(useEstimateStore.getState().step2.selectedProcesses.length > 0 ? target : 1);
  };

  if (restoring) {
    return <div className={pageStyles.page} aria-busy="true" />;
  }

  const renderBody = () => {
    if (result) {
      return <TrialEstimateResult preview={result} onEdit={backToInput} />;
    }
    if (step === 4 && error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '48px 0' }}>
          <p role="alert" style={{ color: '#EF4444', fontSize: '15px', textAlign: 'center', wordBreak: 'keep-all' }}>
            {error}
          </p>
          <button
            type="button"
            onClick={() => backToInput(3)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E7EB', cursor: 'pointer' }}
          >
            이전 단계로 돌아가기
          </button>
        </div>
      );
    }
    if (step === 4) {
      return <EstimateLoadingScreen region={region} processCount={processCount} onCancel={() => backToInput(3)} />;
    }
    const Step = INPUT_STEPS[step];
    return <Step />;
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.content}>
        {!result && step !== 4 && (
          <TrialNotice>
            로그인 없이도 같은 AI로 가견적을 만들어요. 결과 중 한 공정을 먼저 보여드리고, 로그인하면 나머지를 바로
            이어서 볼 수 있어요.
          </TrialNotice>
        )}
        <StepIndicator currentStep={result ? 4 : step} />
        {renderBody()}
      </div>
    </div>
  );
};
