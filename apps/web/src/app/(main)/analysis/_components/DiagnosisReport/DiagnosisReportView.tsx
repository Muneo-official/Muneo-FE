'use client';

import { CircleWarningIcon, StatusCard, TriangleWarningIcon } from '@muneo/design-system';
import { type ReactNode } from 'react';
import { type AnalysisPreviewSection } from '@/api/trial';
import { type DiagnosisResult } from '../../_types/analysis.types';
import { DiagnosisInsights } from '../DiagnosisInsights/DiagnosisInsights';
import { LockedProcessSection } from '../ProcessSection/LockedProcessSection';
import { ProcessSection } from '../ProcessSection/ProcessSection';
import * as styles from './DiagnosisReport.css';

/** 비회원 체험 결과처럼 대표 공정 하나만 공개할 때 넘긴다. */
export interface DiagnosisReportLock {
  /** 원래 순서대로 나열한 전체 공정. 잠긴 공정은 이름과 건수만 있다. */
  sections: AnalysisPreviewSection[];
  loginHref: string;
}

interface DiagnosisReportViewProps {
  result: DiagnosisResult;
  lock?: DiagnosisReportLock;
  className?: string;
  /** 피드백·저장 같은 하단 영역 */
  children?: ReactNode;
}

const countLockedIssues = (sections: AnalysisPreviewSection[]) =>
  sections
    .filter((section) => section.locked)
    .reduce((sum, { counts }) => sum + counts.누락 + counts.중복 + counts.불분명, 0);

export const DiagnosisReportView = ({ result, lock, className, children }: DiagnosisReportViewProps) => (
  <div className={[styles.container, className].filter(Boolean).join(' ')}>
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

    <DiagnosisInsights
      result={result}
      lock={lock ? { hiddenCount: countLockedIssues(lock.sections), loginHref: lock.loginHref } : undefined}
    />

    <div className={styles.sections}>
      {lock
        ? lock.sections.map((summary) => {
            const section = result.sections.find(({ id }) => id === summary.id);
            return summary.locked || !section ? (
              <LockedProcessSection key={summary.id} section={summary} loginHref={lock.loginHref} />
            ) : (
              <ProcessSection key={summary.id} section={section} />
            );
          })
        : result.sections.map((section) => <ProcessSection key={section.id} section={section} />)}
    </div>

    {children}
  </div>
);
