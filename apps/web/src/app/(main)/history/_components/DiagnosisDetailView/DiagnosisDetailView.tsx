'use client';

import { CircleWarningIcon, StatusCard, TriangleWarningIcon } from '@muneo/design-system';
import { DiagnosisFeedback } from '@/app/(main)/analysis/_components/DiagnosisFeedback/DiagnosisFeedback';
import { DiagnosisInsights } from '@/app/(main)/analysis/_components/DiagnosisInsights/DiagnosisInsights';
import { ProcessSection } from '@/app/(main)/analysis/_components/ProcessSection/ProcessSection';
import { type DiagnosisResult } from '@/app/(main)/analysis/_types/analysis.types';
import * as styles from './DiagnosisDetailView.css';

interface DiagnosisDetailViewProps {
  result: DiagnosisResult;
  reportId?: string;
}

export const DiagnosisDetailView = ({ result, reportId }: DiagnosisDetailViewProps) => {
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
          description="필수 항목 미포함"
          highlight
          className={styles.summaryCard}
        />
        <StatusCard
          variant="warning"
          icon={<CircleWarningIcon width={24} height={24} />}
          label="불분명 항목"
          value={`${result.riskCount}건`}
          description="범위·규격 확인 필요"
          highlight
          className={styles.summaryCard}
        />
        <StatusCard
          variant="info"
          icon={<CircleWarningIcon width={24} height={24} />}
          label="중복 항목"
          value={`${result.insufficientCount}건`}
          description="범위·비용 중복 확인"
          highlight
          className={styles.summaryCard}
        />
      </div>

      <DiagnosisInsights result={result} />
      <div className={styles.sections}>
        {result.sections.map((section) => (
          <ProcessSection key={section.id} section={section} />
        ))}
      </div>

      <DiagnosisFeedback key={reportId} reportId={reportId} />
    </div>
  );
};
