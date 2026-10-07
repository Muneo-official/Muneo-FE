'use client';

import { Button, CircleWarningIcon, StatusCard, TriangleWarningIcon } from '@muneo/design-system';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveRisk } from '@/api/analyze';
import { useUser } from '@/app/(main)/_components/UserProvider/UserProvider';
import { useAnalysisStore } from '../../_store/analysisStore';
import { DiagnosisInsights } from '../DiagnosisInsights/DiagnosisInsights';
import { ProcessSection } from '../ProcessSection/ProcessSection';
import * as styles from './DiagnosisReport.css';

export const DiagnosisReport = () => {
  const result = useAnalysisStore((s) => s.diagnosisResult);
  const rawReport = useAnalysisStore((s) => s.rawReport);
  const rawInput = useAnalysisStore((s) => s.rawInput);
  const reset = useAnalysisStore((s) => s.reset);
  const user = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  if (!result || !rawReport || !rawInput) {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    setSaveErrorMsg(null);
    try {
      await saveRisk({ input: rawInput, result: { report: rawReport } }, user.id);
      reset();
      router.push('/home');
    } catch {
      setSaveErrorMsg('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
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

      {saveErrorMsg && <p className={styles.saveError}>{saveErrorMsg}</p>}
      <div className={styles.actionRow}>
        <Button variant="primary" size="md" onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '저장하기'}
        </Button>
      </div>
    </div>
  );
};
