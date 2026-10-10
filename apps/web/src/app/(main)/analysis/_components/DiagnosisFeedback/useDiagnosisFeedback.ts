import { useEffect, useRef, useState } from 'react';
import { toApiError } from '@/api/errors';
import {
  deleteDiagnosisFeedback,
  getDiagnosisFeedback,
  saveDiagnosisFeedback,
  type DiagnosisFeedback,
  type FeedbackRating,
  type FeedbackReason,
} from '@/api/feedback';

interface FeedbackDraft {
  rating: FeedbackRating | null;
  reasons: FeedbackReason[];
  comment: string;
}
type Conflict = { status: 'loading' | 'error' } | { status: 'ready'; latest: DiagnosisFeedback | null };
const emptyDraft = (): FeedbackDraft => ({ rating: null, reasons: [], comment: '' });
const toDraft = (feedback: DiagnosisFeedback | null): FeedbackDraft =>
  feedback ? { rating: feedback.rating, reasons: feedback.reasons, comment: feedback.comment } : emptyDraft();

const feedbackError = (error: unknown, action: 'load' | 'save' | 'delete') => {
  const apiError = toApiError(error);
  switch (apiError.status) {
    case 400:
      return '평가와 선택 이유, 의견 길이(최대 500자)를 확인해 주세요. 작성한 내용은 유지돼요.';
    case 401:
      return '로그인이 만료되었어요. 다시 로그인해 주세요.';
    case 403:
      return '이 진단의 의견에 접근할 권한이 없어요. 본인이 저장한 진단인지 확인해 주세요.';
    case 404:
      return '저장된 진단을 찾을 수 없어요. 진단 내역을 다시 확인해 주세요.';
    case 422:
      return '의견을 처리하지 못했어요. 작성한 내용은 유지돼요. 잠시 후 다시 시도해 주세요.';
    case 503:
      return '저장소에 잠시 연결할 수 없어요. 작성한 내용은 유지돼요. 잠시 후 다시 시도해 주세요.';
    default:
      return action === 'load'
        ? '저장된 의견을 불러오지 못했어요. 기존 의견을 확인한 뒤 작성할 수 있어요.'
        : `의견을 ${action === 'delete' ? '삭제하' : '보내'}지 못했어요. 작성한 내용은 유지돼요. 다시 시도해 주세요.`;
  }
};

/** 부모가 mode/reportId를 key로 사용해 다른 진단의 입력과 응답이 섞이지 않게 한다. */
export const useDiagnosisFeedback = (reportId?: string) => {
  const [draft, setDraft] = useState<FeedbackDraft>(emptyDraft);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>(reportId ? 'loading' : 'ready');
  const [submitted, setSubmitted] = useState(false);
  const [persisted, setPersisted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const pending = useRef(false);
  const active = useRef(false);

  const applyFeedback = (feedback: DiagnosisFeedback | null) => {
    setDraft(toDraft(feedback));
    setPersisted(Boolean(feedback));
    setSubmitted(Boolean(feedback));
  };

  useEffect(() => {
    active.current = true;
    const controller = new AbortController();
    if (reportId) {
      void getDiagnosisFeedback(reportId, controller.signal).then(
        (feedback) => {
          if (!controller.signal.aborted) {
            applyFeedback(feedback);
            setPhase('ready');
          }
        },
        (cause: unknown) => {
          if (!controller.signal.aborted) {
            setError(feedbackError(cause, 'load'));
            setPhase('error');
          }
        }
      );
    }
    return () => {
      active.current = false;
      controller.abort();
    };
  }, [reportId]);

  const reload = async () => {
    if (!reportId || pending.current) {
      return;
    }
    pending.current = true;
    setPhase('loading');
    setError('');
    try {
      const feedback = await getDiagnosisFeedback(reportId);
      if (!active.current) {
        return;
      }
      applyFeedback(feedback);
      setPhase('ready');
    } catch (cause) {
      if (!active.current) {
        return;
      }
      setError(feedbackError(cause, 'load'));
      setPhase('error');
    } finally {
      pending.current = false;
    }
  };

  const loadConflict = async () => {
    if (!reportId) {
      return;
    }
    setConflict({ status: 'loading' });
    try {
      const latest = await getDiagnosisFeedback(reportId);
      if (active.current) {
        setConflict({ status: 'ready', latest });
      }
    } catch {
      if (active.current) {
        setConflict({ status: 'error' });
      }
    }
  };

  const mutate = async (action: 'save' | 'delete') => {
    if (pending.current || phase !== 'ready' || conflict) {
      return;
    }
    if (action === 'save' && !draft.rating) {
      setError('도움이 되었는지 먼저 선택해 주세요.');
      return;
    }
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      if (action === 'delete') {
        if (reportId) {
          await deleteDiagnosisFeedback(reportId);
        }
        if (active.current) {
          applyFeedback(null);
        }
      } else {
        if (reportId && draft.rating) {
          await saveDiagnosisFeedback(reportId, {
            schema_version: 1,
            ...draft,
            rating: draft.rating,
            comment: draft.comment.trim(),
          });
        }
        if (active.current) {
          setDraft((current) => ({ ...current, comment: current.comment.trim() }));
          setPersisted(Boolean(reportId));
          setSubmitted(true);
        }
      }
    } catch (cause) {
      if (!active.current) {
        return;
      }
      if (toApiError(cause).status === 409) {
        // 사용자의 입력은 보존하고 최신 의견만 따로 조회한다. PUT을 자동 반복하지 않는다.
        await loadConflict();
      } else {
        setError(feedbackError(cause, action));
      }
    } finally {
      pending.current = false;
      if (active.current) {
        setBusy(false);
      }
    }
  };

  const resolveConflict = (useLatest: boolean) => {
    if (conflict?.status !== 'ready') {
      return;
    }
    if (useLatest) {
      applyFeedback(conflict.latest);
    } else {
      setPersisted(Boolean(conflict.latest));
      setSubmitted(false);
    }
    setConflict(null);
    setError('');
  };

  return {
    draft,
    setDraft,
    phase,
    submitted,
    setSubmitted,
    persisted,
    busy,
    error,
    setError,
    conflict,
    reload,
    loadConflict,
    resolveConflict,
    save: () => mutate('save'),
    remove: () => mutate('delete'),
  };
};
