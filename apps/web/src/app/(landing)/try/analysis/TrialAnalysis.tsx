'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { type AnalysisPreview, analyzeTrial } from '@/api/trial';
import { AnalysisLoadingScreen } from '@/app/(main)/analysis/_components/AnalysisLoadingScreen/AnalysisLoadingScreen';
import * as reportStyles from '@/app/(main)/analysis/_components/DiagnosisReport/DiagnosisReport.css';
import { DiagnosisReportView } from '@/app/(main)/analysis/_components/DiagnosisReport/DiagnosisReportView';
import { InputForm } from '@/app/(main)/analysis/_components/InputForm/InputForm';
import { UploadPanelContent } from '@/app/(main)/analysis/_components/UploadPanel/UploadPanel';
import { buildAnalysisPayload } from '@/app/(main)/analysis/_lib/analysisPayload';
import { mapApiReportToDiagnosisResult } from '@/app/(main)/analysis/_lib/mapApiReport';
import { useAnalysisStore } from '@/app/(main)/analysis/_store/analysisStore';
import * as styles from '@/app/(main)/analysis/page.css';
import { PendingLinkLabel } from '@/components/PendingLinkLabel';
import { getLoginHref, getSignupHref } from '@/lib/authRedirect';
import { useTrialResultPath } from '../_components/GuestShell';
import { TrialNotice } from '../_components/TrialNotice';
import { TrialUnlockNote } from '../_components/TrialUnlockNote';
import { useTrialSession } from '../_hooks/useTrialSession';

const RESULT_PATH = '/analysis/trial';

const TrialDiagnosisResult = ({ preview, onEdit }: { preview: AnalysisPreview; onEdit: () => void }) => {
  const loginHref = getLoginHref(RESULT_PATH);
  // 레포트에는 대표 공정만 있으므로 상단 건수는 서버가 전체 결과로 센 값을 쓴다.
  const result = useMemo(
    () => ({
      ...mapApiReportToDiagnosisResult(preview.report),
      missingCount: preview.counts.누락,
      riskCount: preview.counts.불분명,
      insufficientCount: preview.counts.중복,
    }),
    [preview]
  );
  const lockedCount = preview.sections.filter((section) => section.locked).length;

  return (
    <DiagnosisReportView result={result} lock={{ sections: preview.sections, loginHref }}>
      <TrialUnlockNote
        title={lockedCount > 0 ? `나머지 ${lockedCount}개 공정의 진단이 잠겨 있어요` : '전체 결과를 저장해 두세요'}
        signupHref={getSignupHref(RESULT_PATH)}
      />
      <div className={reportStyles.actionRow}>
        <Button variant="outlineSecondary" size="md" onClick={onEdit}>
          입력 수정하기
        </Button>
        <Button as={Link} href={loginHref} variant="gradient" size="md">
          <PendingLinkLabel>로그인하고 전체 결과 보기</PendingLinkLabel>
        </Button>
      </div>
    </DiagnosisReportView>
  );
};

export const TrialAnalysis = () => {
  const { preview, loading, restoring, error, run, cancel, edit, setError } = useTrialSession('analysis');
  const companyName = useAnalysisStore((s) => s.form.companyName);
  const fileCount = useAnalysisStore((s) => s.files.length);
  const result = preview?.kind === 'analysis' ? preview : null;
  useTrialResultPath(result ? RESULT_PATH : null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [result]);

  const submit = () => {
    try {
      const { form, files } = useAnalysisStore.getState();
      const { body } = buildAnalysisPayload(form, files);
      void run((signal) => analyzeTrial(body, signal));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '입력 내용을 확인해 주세요.');
    }
  };

  if (restoring) {
    return <div className={styles.page} aria-busy="true" />;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <AnalysisLoadingScreen companyName={companyName} fileCount={fileCount} onCancel={cancel} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {error && (
          <p role="alert" className={styles.errorText}>
            {error}
          </p>
        )}
        {result ? (
          <TrialDiagnosisResult preview={result} onEdit={edit} />
        ) : (
          <>
            <TrialNotice>
              로그인 없이도 같은 AI로 진단해요. 한 공정의 진단 결과를 먼저 보여드리고, 로그인하면 나머지를 바로 이어서
              볼 수 있어요. 연락처·상세 주소 등은 가리고 올려 주세요.
            </TrialNotice>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>견적서 진단</h1>
              <p className={styles.pageSubtitle}>업체 견적서의 누락·중복·불분명 항목을 AI가 분석합니다.</p>
            </div>
            <div className={styles.inputLayout}>
              <InputForm />
              <UploadPanelContent onSubmit={submit} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
