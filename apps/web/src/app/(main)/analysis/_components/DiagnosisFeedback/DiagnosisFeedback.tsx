'use client';

import { Button, SelectButton } from '@muneo/design-system';
import { useId, useState } from 'react';
import { FEEDBACK_REASONS } from '@/api/feedback';
import { useDiagnosisFeedback } from './useDiagnosisFeedback';
import * as styles from './DiagnosisFeedback.css';

export type FeedbackMode = 'preview' | 'api' | 'disabled';
export const getFeedbackMode = (): FeedbackMode => {
  const mode = process.env.NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE;
  if (!mode || mode === 'api') {
    return 'api';
  }
  return mode === 'preview' ? 'preview' : 'disabled';
};

interface DiagnosisFeedbackProps {
  reportId?: string | null;
  mode?: FeedbackMode;
}

const FeedbackForm = ({ reportId }: { reportId?: string }) => {
  const feedback = useDiagnosisFeedback(reportId);
  const { draft, phase, submitted, persisted, busy, error, conflict } = feedback;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const preview = !reportId;

  if (phase === 'loading') {
    return (
      <p role="status" className={styles.hint}>
        저장된 의견을 불러오는 중이에요.
      </p>
    );
  }
  if (phase === 'error') {
    return (
      <>
        <p role="alert" className={styles.error}>
          {error}
        </p>
        <Button variant="outlineSecondary" onClick={feedback.reload}>
          다시 불러오기
        </Button>
      </>
    );
  }

  return (
    <>
      {preview && (
        <p className={styles.notice}>체험 화면이에요. 의견은 서버에 전송되지 않으며, 이 화면을 떠나면 사라져요.</p>
      )}
      <fieldset className={styles.fields} disabled={busy || submitted || Boolean(conflict) || confirmDelete}>
        <legend className={styles.hint}>진단 만족도</legend>
        <div className={styles.row}>
          {(['good', 'bad'] as const).map((value) => (
            <SelectButton
              key={value}
              selected={draft.rating === value}
              onClick={() => {
                feedback.setDraft((current) => ({
                  ...current,
                  rating: value,
                  reasons: current.rating === value ? current.reasons : [],
                }));
                feedback.setError('');
              }}
            >
              {value === 'good' ? '도움이 됐어요' : '아쉬워요'}
            </SelectButton>
          ))}
        </div>
        {draft.rating && (
          <>
            <p className={styles.hint}>어떤 점이 그랬나요? (선택, 최대 3개)</p>
            <div className={styles.row}>
              {FEEDBACK_REASONS[draft.rating].map((reason) => (
                <SelectButton
                  key={reason.value}
                  selected={draft.reasons.includes(reason.value)}
                  onClick={() =>
                    feedback.setDraft((current) => ({
                      ...current,
                      reasons: current.reasons.includes(reason.value)
                        ? current.reasons.filter((value) => value !== reason.value)
                        : [...current.reasons, reason.value],
                    }))
                  }
                >
                  {reason.label}
                </SelectButton>
              ))}
            </div>
            <label className={styles.label}>
              더 알려주고 싶은 내용 (선택)
              <textarea
                className={styles.textarea}
                value={draft.comment}
                maxLength={500}
                onChange={(event) => feedback.setDraft((current) => ({ ...current, comment: event.target.value }))}
                placeholder="개인정보나 업체 연락처는 입력하지 말아 주세요."
              />
              <span>{draft.comment.length}/500자</span>
            </label>
          </>
        )}
      </fieldset>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {conflict ? (
        <div className={styles.conflict} role="alert">
          <p>다른 화면에서 의견이 변경되었어요. 작성 중인 내용은 유지돼요.</p>
          {conflict.status === 'loading' && <p>최신 의견을 확인하고 있어요.</p>}
          {conflict.status === 'error' && (
            <>
              <p>최신 의견을 불러오지 못했어요. 확인 후 다시 보낼 수 있어요.</p>
              <Button variant="outlineSecondary" onClick={feedback.loadConflict}>
                최신 의견 다시 불러오기
              </Button>
            </>
          )}
          {conflict.status === 'ready' && (
            <>
              {conflict.latest ? (
                <div className={styles.notice}>
                  <p>현재 저장된 의견: {conflict.latest.rating === 'good' ? '도움이 됐어요' : '아쉬워요'}</p>
                  <p>
                    {FEEDBACK_REASONS[conflict.latest.rating]
                      .filter((reason) => conflict.latest?.reasons.includes(reason.value))
                      .map((reason) => reason.label)
                      .join(' · ') || '선택한 이유 없음'}
                  </p>
                  <p className={styles.comment}>{conflict.latest.comment || '추가 의견 없음'}</p>
                </div>
              ) : (
                <p>현재 저장된 의견이 없어요.</p>
              )}
              <div className={styles.row}>
                <Button
                  variant="outlineSecondary"
                  onClick={() => {
                    feedback.resolveConflict(true);
                    setConfirmDelete(false);
                  }}
                >
                  최신 의견 불러오기
                </Button>
                <Button
                  variant="outlineSecondary"
                  onClick={() => {
                    feedback.resolveConflict(false);
                    setConfirmDelete(false);
                  }}
                >
                  작성한 내용 유지
                </Button>
              </div>
              <p className={styles.hint}>
                최신 의견을 불러오면 입력 내용이 교체돼요. 작성한 내용을 유지하면 확인 후 직접 다시 보낼 수 있어요.
              </p>
            </>
          )}
        </div>
      ) : confirmDelete ? (
        <div className={styles.conflict}>
          <p>남긴 의견을 삭제할까요? 저장된 진단 결과는 그대로 유지돼요.</p>
          <div className={styles.row}>
            <Button
              disabled={busy}
              aria-busy={busy}
              onClick={async () => {
                await feedback.remove();
                setConfirmDelete(false);
              }}
            >
              {busy ? '삭제하는 중...' : '삭제 확인'}
            </Button>
            <Button variant="outlineSecondary" disabled={busy} onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
          </div>
        </div>
      ) : (
        <>
          {submitted && (
            <p role="status" className={styles.hint}>
              {preview
                ? '미리보기를 완료했어요. 실제 의견은 저장되지 않았어요.'
                : '저장된 의견이에요. 의견을 보내주셔서 감사해요.'}
            </p>
          )}
          <div className={styles.row}>
            {submitted ? (
              <Button
                variant="outlineSecondary"
                onClick={() => {
                  feedback.setSubmitted(false);
                  feedback.setError('');
                }}
              >
                의견 수정
              </Button>
            ) : (
              <Button onClick={feedback.save} disabled={busy} aria-busy={busy}>
                {busy ? '보내는 중...' : preview ? '피드백 미리보기' : '의견 보내기'}
              </Button>
            )}
            {persisted && (
              <Button
                variant="outlineSecondary"
                disabled={busy}
                onClick={() => {
                  setConfirmDelete(true);
                  feedback.setError('');
                }}
              >
                의견 삭제
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export const DiagnosisFeedback = ({ reportId, mode = getFeedbackMode() }: DiagnosisFeedbackProps) => {
  const titleId = useId();
  if (mode === 'disabled') {
    return null;
  }
  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        이 진단이 도움이 되었나요?
      </h2>
      <p className={styles.hint}>좋았던 점이나 아쉬웠던 점을 알려 주세요. 피드백은 선택 사항이에요.</p>
      {mode === 'api' && !reportId ? (
        <p className={styles.notice}>의견을 보내려면 아래에서 진단 결과를 먼저 저장해 주세요.</p>
      ) : (
        <FeedbackForm
          key={`${mode}:${reportId ?? ''}`}
          reportId={mode === 'api' ? (reportId ?? undefined) : undefined}
        />
      )}
    </section>
  );
};
