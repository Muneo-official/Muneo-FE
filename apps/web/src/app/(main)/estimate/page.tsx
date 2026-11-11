'use client';

import { useEffect } from 'react';
import { generateEstimate } from '@/api/estimate';
import { trackEvent } from '@/lib/analytics';
import { EstimateErrorState } from './_components/EstimateErrorState/EstimateErrorState';
import { EstimateLoadingScreen } from './_components/EstimateLoadingScreen/EstimateLoadingScreen';
import { Step1BasicInfo } from './_components/Step1BasicInfo/Step1BasicInfo';
import { Step2ProcessSelection } from './_components/Step2ProcessSelection/Step2ProcessSelection';
import { Step3ConstructionConditions } from './_components/Step3ConstructionConditions/Step3ConstructionConditions';
import { EstimateResult } from './_components/Step5EstimateReview/Step5EstimateReview';
import { StepIndicator } from './_components/StepIndicator/StepIndicator';
import { useEstimateStore } from './_store/estimateStore';
import { mapToApiPayload } from './_utils/mapToApiPayload';
import * as styles from './page.css';

const STEP_COMPONENTS = {
  1: Step1BasicInfo,
  2: Step2ProcessSelection,
  3: Step3ConstructionConditions,
  4: EstimateResult,
} as const;

const EstimatePage = () => {
  const currentStep = useEstimateStore((s) => s.currentStep);
  const step1 = useEstimateStore((s) => s.step1);
  const step2 = useEstimateStore((s) => s.step2);
  const isGenerating = useEstimateStore((s) => s.isGenerating);
  const generateError = useEstimateStore((s) => s.generateError);
  const estimateResult = useEstimateStore((s) => s.estimateResult);
  const setGeneratingState = useEstimateStore((s) => s.setGeneratingState);
  const setEstimateResult = useEstimateStore((s) => s.setEstimateResult);
  const goToStep = useEstimateStore((s) => s.goToStep);

  useEffect(() => {
    if (currentStep !== 4 || useEstimateStore.getState().estimateResult) {
      return;
    }
    const controller = new AbortController();
    const { step1, step2, step3, step4 } = useEstimateStore.getState();
    setGeneratingState(true, null);
    const processCount = step2.selectedProcesses.length;
    const fetchEstimate = async () => {
      try {
        const payload = mapToApiPayload(step1, step2, step3, step4);
        const result = await generateEstimate(payload, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setEstimateResult(result);
        setGeneratingState(false, null);
        trackEvent('estimate_generate_success', { process_count: processCount });
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setGeneratingState(false, '가견적 생성에 실패했습니다. 다시 시도해 주세요.');
        trackEvent('estimate_generate_error', { process_count: processCount });
      }
    };
    void fetchEstimate();
    return () => {
      controller.abort();
      setGeneratingState(false, null);
    };
  }, [currentStep, setGeneratingState, setEstimateResult]);

  if (currentStep === 4 && (isGenerating || (!estimateResult && !generateError))) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <StepIndicator currentStep={currentStep} />
          <EstimateLoadingScreen
            region={step1.region}
            processCount={step2.selectedProcesses.length}
            onCancel={() => {
              setGeneratingState(false, null);
              goToStep(3);
            }}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 4 && generateError) {
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <StepIndicator currentStep={currentStep} />
          <EstimateErrorState
            message={generateError}
            onBack={() => {
              setGeneratingState(false, null);
              goToStep(3);
            }}
          />
        </div>
      </div>
    );
  }

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <StepIndicator currentStep={currentStep} />
        <StepComponent />
      </div>
    </div>
  );
};

export default EstimatePage;
