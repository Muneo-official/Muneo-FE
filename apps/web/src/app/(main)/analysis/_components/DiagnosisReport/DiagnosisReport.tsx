'use client';

import { Button, CircleWarningIcon, StatusCard, TriangleWarningIcon } from '@muneo/design-system';
import { useRef, useState } from 'react';
import { saveRisk } from '@/api/analyze';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { TransitionLink } from '@/components/TransitionLink';
import { useAnalysisStore } from '../../_store/analysisStore';
import { DiagnosisFeedback } from '../DiagnosisFeedback/DiagnosisFeedback';
import { DiagnosisInsights } from '../DiagnosisInsights/DiagnosisInsights';
import { ProcessSection } from '../ProcessSection/ProcessSection';
import * as styles from './DiagnosisReport.css';

export const DiagnosisReport = () => {
  const reset = useAnalysisStore((s) => s.reset);
  const result = useAnalysisStore((s) => s.diagnosisResult);
  const rawReport = useAnalysisStore((s) => s.rawReport);
  const rawInput = useAnalysisStore((s) => s.rawInput);
  const savedReportId = useAnalysisStore((s) => s.savedReportId);
  const setSavedReportId = useAnalysisStore((s) => s.setSavedReportId);
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
    <div className={styles.container}>
      <div className={styles.reportHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.reportTitle}>진단 레포트</h1>
          <span className={styles.reportMeta}>
            {result.vendorLabel} · {result.areaLabel} · 분석일 {result.analyzedAt}
          </span>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <StatusCard
          variant="danger"
          icon={<TriangleWarningIcon width={24} height={24} />}
          label="누락항목"
          value={`${result.missingCount}건`}
          className={styles.summaryCard}
        />
        <StatusCard
          variant="warning"
          icon={<CircleWarningIcon width={24} height={24} />}
          label="불분명 항목"
          value={`${result.riskCount}건`}
          className={styles.summaryCard}
        />
        <StatusCard
          variant="info"
          icon={<CircleWarningIcon width={24} height={24} />}
          label="중복 항목"
          value={`${result.insufficientCount}건`}
          className={styles.summaryCard}
        />
      </div>

      <DiagnosisInsights result={result} />

      <div className={styles.sections}>
        {result.sections.map((section) => (
          <ProcessSection key={section.id} section={section} />
        ))}
      </div>

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
    </div>
  );
};
