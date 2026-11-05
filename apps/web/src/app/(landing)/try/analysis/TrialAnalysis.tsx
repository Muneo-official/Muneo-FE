'use client';

import dynamic from 'next/dynamic';
import { analyzeTrial } from '@/api/trial';
import { InputForm } from '@/app/(main)/analysis/_components/InputForm/InputForm';
import { UploadPanelContent } from '@/app/(main)/analysis/_components/UploadPanel/UploadPanel';
import { buildAnalysisPayload } from '@/app/(main)/analysis/_lib/analysisPayload';
import { useAnalysisStore } from '@/app/(main)/analysis/_store/analysisStore';
import * as styles from '../_components/TrialLayout.css';
import { TrialLoading } from '../_components/TrialLoading';
import { TrialRestore } from '../_components/TrialRestore';
import { useTrialSession } from '../_hooks/useTrialSession';

const Preview = dynamic(() => import('../_components/TrialPreview').then((m) => m.TrialPreview), {
  loading: () => <p role="status">결과를 표시하고 있어요.</p>,
});

export const TrialAnalysis = () => {
  const { preview, loading, restoring, error, run, cancel, edit, setError } = useTrialSession('analysis');
  const submit = () => {
    try {
      const { form, files } = useAnalysisStore.getState();
      const { body } = buildAnalysisPayload(form, files);
      void import('../_components/TrialPreview');
      void run((signal) => analyzeTrial(body, signal));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '입력 내용을 확인해 주세요.');
    }
  };
  return (
    <main className={styles.page}>
      {restoring ? (
        <TrialRestore />
      ) : loading ? (
        <TrialLoading kind="analysis" onCancel={cancel} />
      ) : preview ? (
        <Preview preview={preview} onEdit={edit} />
      ) : (
        <>
          <header className={styles.header}>
            <p className={styles.eyebrow}>로그인 없이 먼저 체험</p>
            <h1 className={styles.heading}>내 견적서, 먼저 진단해 보세요</h1>
            <p className={styles.text}>
              공사 정보와 견적서를 올리면 실제 진단 결과 일부를 바로 보여드려요. 전체 결과를 보고 싶을 때 로그인하세요.
            </p>
          </header>
          <p className={styles.notice}>
            진단에 불필요한 연락처·상세 주소 등은 가리고 올려 주세요. 진단이 완료되면 이 브라우저에서 30분 안에 로그인해
            전체 결과를 이어서 확인하세요.
          </p>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <div className={styles.inputLayout}>
            <InputForm />
            <UploadPanelContent onSubmit={submit} submitLabel="로그인 없이 진단 시작" />
          </div>
        </>
      )}
    </main>
  );
};
