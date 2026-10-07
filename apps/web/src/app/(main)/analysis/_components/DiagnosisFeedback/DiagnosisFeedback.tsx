'use client';

import { Button, SelectButton } from '@muneo/design-system';
import { useId, useRef, useState } from 'react';
import { FEEDBACK_REASONS, saveDiagnosisFeedback, type FeedbackRating, type FeedbackReason } from '@/api/feedback';
import * as styles from './DiagnosisFeedback.css';

export type FeedbackMode = 'preview' | 'api' | 'disabled';
export const getFeedbackMode = (): FeedbackMode => {
  const mode = process.env.NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE;
  return mode === 'api' || mode === 'preview' ? mode : 'disabled';
};

interface DiagnosisFeedbackProps {
  reportId?: string | null;
  mode?: FeedbackMode;
}

export const DiagnosisFeedback = ({ reportId, mode = getFeedbackMode() }: DiagnosisFeedbackProps) => {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [reasons, setReasons] = useState<FeedbackReason[]>([]);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const titleId = useId();

  if (mode === 'disabled') {
    return null;
  }

  const submit = async () => {
    if (pending.current) {
      return;
    }
    if (!rating) {
      setError('도움이 되었는지 먼저 선택해 주세요.');
      return;
    }
    if (mode === 'api' && !reportId) {
      setError('진단 결과를 먼저 저장한 뒤 의견을 보내 주세요.');
      return;
    }
    pending.current = true;
    setSaving(true);
    setError('');
    try {
      if (mode === 'api' && reportId) {
        await saveDiagnosisFeedback(reportId, {
          schema_version: 1,
          rating,
          reasons,
          comment: comment.trim(),
        });
      }
      setSubmitted(true);
    } catch {
      setError('의견을 보내지 못했어요. 작성한 내용은 유지돼요. 잠시 후 다시 시도해 주세요.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };

  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        이 진단이 도움이 되었나요?
      </h2>
      <p className={styles.hint}>좋았던 점이나 아쉬웠던 점을 알려 주세요. 피드백은 선택 사항이에요.</p>
      {mode === 'preview' && (
        <p className={styles.notice}>체험 화면이에요. 의견은 서버에 전송되지 않으며, 이 화면을 떠나면 사라져요.</p>
      )}
      {mode === 'api' && !reportId && (
        <p className={styles.notice}>의견을 보내려면 아래에서 진단 결과를 먼저 저장해 주세요.</p>
      )}
      <fieldset className={styles.fields} disabled={saving || submitted}>
        <legend className={styles.hint}>진단 만족도</legend>
        <div className={styles.row}>
          {(['good', 'bad'] as const).map((value) => (
            <SelectButton
              key={value}
              selected={rating === value}
              onClick={() => {
                setRating(value);
                setReasons([]);
                setError('');
              }}
            >
              {value === 'good' ? '도움이 됐어요' : '아쉬워요'}
            </SelectButton>
          ))}
        </div>
        {rating && (
          <>
            <p className={styles.hint}>어떤 점이 그랬나요? (선택, 여러 개 선택 가능)</p>
            <div className={styles.row}>
              {FEEDBACK_REASONS[rating].map((reason) => (
                <SelectButton
                  key={reason.value}
                  selected={reasons.includes(reason.value)}
                  onClick={() =>
                    setReasons((previous) =>
                      previous.includes(reason.value)
                        ? previous.filter((value) => value !== reason.value)
                        : [...previous, reason.value]
                    )
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
                value={comment}
                maxLength={500}
                onChange={(event) => setComment(event.target.value)}
                placeholder="개인정보나 업체 연락처는 입력하지 말아 주세요."
              />
              <span>{comment.length}/500자</span>
            </label>
          </>
        )}
      </fieldset>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {submitted ? (
        <>
          <p role="status" className={styles.hint}>
            {mode === 'preview'
              ? '미리보기를 완료했어요. 실제 의견은 저장되지 않았어요.'
              : '의견을 보내주셔서 감사해요.'}
          </p>
          <Button variant="outlineSecondary" onClick={() => setSubmitted(false)}>
            의견 수정
          </Button>
        </>
      ) : (
        <div className={styles.row}>
          <Button onClick={submit} disabled={saving} aria-busy={saving}>
            {saving ? '보내는 중...' : mode === 'preview' ? '피드백 미리보기' : '의견 보내기'}
          </Button>
        </div>
      )}
    </section>
  );
};
