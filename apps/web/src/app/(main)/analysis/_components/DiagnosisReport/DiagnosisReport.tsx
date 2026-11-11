'use client';

import { Button } from '@muneo/design-system';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { saveRisk } from '@/api/analyze';
import { type FullAnalysisTrial } from '@/api/trial';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { TransitionLink } from '@/components/TransitionLink';
import { DiagnosisReportView } from './DiagnosisReportView';
import { mapApiReportToDiagnosisResult } from '../../_lib/mapApiReport';
import { useAnalysisStore } from '../../_store/analysisStore';
import { DiagnosisFeedback } from '../DiagnosisFeedback/DiagnosisFeedback';
import * as styles from './DiagnosisReport.css';

export const DiagnosisReport = ({ trial, className }: { trial?: FullAnalysisTrial; className?: string }) => {
  const resetStore = useAnalysisStore((s) => s.reset);
  const storedResult = useAnalysisStore((s) => s.diagnosisResult);
  const storedReport = useAnalysisStore((s) => s.rawReport);
  const storedInput = useAnalysisStore((s) => s.rawInput);
  const storedReportId = useAnalysisStore((s) => s.savedReportId);
  const setStoredReportId = useAnalysisStore((s) => s.setSavedReportId);
  const [trialReportId, setTrialReportId] = useState<string | null>(null);
  const router = useRouter();
  const result = trial ? mapApiReportToDiagnosisResult(trial.result.report) : storedResult;
  const rawReport = trial?.result.report ?? storedReport;
  const rawInput = trial?.input ?? storedInput;
  const savedReportId = trial ? trialReportId : storedReportId;
  const setSavedReportId = trial ? setTrialReportId : setStoredReportId;
  const reset = () => {
    resetStore();
    if (trial) {
      router.push('/analysis');
    }
  };
  const user = useUser();
  const savingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  if (!result || !rawReport || !rawInput) {
    return null;
  }

  const handleSave = async () => {
    if (savingRef.current || savedReportId) {
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    setSaveErrorMsg(null);
    try {
      const { id } = await saveRisk({ input: rawInput, result: { report: rawReport } }, user.id);
      setSavedReportId(id);
    } catch {
      setSaveErrorMsg('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <DiagnosisReportView result={result} className={className}>
      <DiagnosisFeedback key={result.analyzedAt} reportId={savedReportId} />

      {saveErrorMsg && (
        <p role="alert" className={styles.saveError}>
          {saveErrorMsg}
        </p>
      )}
      <div className={styles.actionRow}>
        {savedReportId ? (
          <>
            <p role="status">분석 이력에 저장했어요.</p>
            <Button variant="outlineSecondary" onClick={reset}>
              다른 견적서 진단
            </Button>
            <Button
              as={TransitionLink}
              href={`/history/${encodeURIComponent(savedReportId)}`}
              variant="outlineSecondary"
            >
              저장한 결과 보기
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        )}
      </div>
    </DiagnosisReportView>
  );
};
