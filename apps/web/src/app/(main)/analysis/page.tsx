'use client';

import { AnalysisLoadingScreen } from './_components/AnalysisLoadingScreen/AnalysisLoadingScreen';
import { DiagnosisReport } from './_components/DiagnosisReport/DiagnosisReport';
import { InputForm } from './_components/InputForm/InputForm';
import { UploadPanel } from './_components/UploadPanel/UploadPanel';
import { useAnalysisStore } from './_store/analysisStore';
import * as styles from './page.css';

const InputView = () => {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>견적서 진단</h1>
        <p className={styles.pageSubtitle}>업체 견적서의 누락·중복·불분명 항목을 AI가 분석합니다.</p>
      </div>
      <div className={styles.inputLayout}>
        <InputForm />
        <UploadPanel />
      </div>
    </>
  );
};

const AnalysisPage = () => {
  const view = useAnalysisStore((s) => s.view);
  const loading = useAnalysisStore((s) => s.loading);
  const error = useAnalysisStore((s) => s.error);
  const form = useAnalysisStore((s) => s.form);
  const files = useAnalysisStore((s) => s.files);
  const cancelAnalysis = useAnalysisStore((s) => s.cancelAnalysis);
  const reset = useAnalysisStore((s) => s.reset);

  if (loading) {
    return (
      <div className={styles.page}>
        <AnalysisLoadingScreen companyName={form.companyName} fileCount={files.length} onCancel={cancelAnalysis} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <p className={styles.errorText}>{error}</p>
          <button type="button" onClick={reset} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.content}>{view === 'input' ? <InputView /> : <DiagnosisReport />}</div>
    </div>
  );
};

export default AnalysisPage;
