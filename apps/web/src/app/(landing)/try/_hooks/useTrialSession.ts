'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTrialPreview, isTrialPreview, type TrialKind, type TrialPreview } from '@/api/trial';

export const useTrialSession = (kind: TrialKind) => {
  const [preview, setPreview] = useState<TrialPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const bootstrap = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const abort = new AbortController();
    const requestId = ++sequence.current;
    bootstrap.current = getTrialPreview(kind, AbortSignal.any([abort.signal, AbortSignal.timeout(10000)]))
      .then((saved) => {
        if (!abort.signal.aborted && requestId === sequence.current) {
          // 이전 형식으로 보관된 결과는 그릴 수 없으므로 새로 체험하게 한다.
          setPreview(isTrialPreview(saved, kind) ? saved : null);
        }
      })
      .catch(() => {
        /* 복원에 실패해도 입력과 새 진단은 계속 이용할 수 있다. */
      })
      .finally(() => {
        if (!abort.signal.aborted) {
          setRestoring(false);
        }
      });
    return () => {
      abort.abort();
      controller.current?.abort();
      controller.current = null;
    };
  }, [kind]);

  const run = useCallback(
    async (execute: (signal: AbortSignal) => Promise<TrialPreview | null>) => {
      if (controller.current) {
        return;
      }
      const abort = new AbortController();
      controller.current = abort;
      const requestId = ++sequence.current;
      setLoading(true);
      setError(null);
      try {
        await bootstrap.current;
        if (abort.signal.aborted || requestId !== sequence.current) {
          return;
        }
        const result = await execute(AbortSignal.any([abort.signal, AbortSignal.timeout(180000)]));
        if (abort.signal.aborted || requestId !== sequence.current) {
          return;
        }
        if (!isTrialPreview(result, kind)) {
          throw new Error('결과를 받지 못했어요. 다시 시도해 주세요.');
        }
        setPreview(result);
      } catch (cause) {
        if (abort.signal.aborted || requestId !== sequence.current) {
          return;
        }
        setError(
          cause instanceof Error && cause.name === 'TimeoutError'
            ? '응답이 오래 걸리고 있어요. 입력은 유지되니 잠시 후 다시 시도해 주세요.'
            : cause instanceof TypeError
              ? '연결이 끊겼어요. 입력은 유지되니 연결을 확인하고 다시 시도해 주세요.'
              : cause instanceof Error
                ? cause.message
                : '분석에 실패했어요. 다시 시도해 주세요.'
        );
      } finally {
        if (requestId === sequence.current) {
          controller.current = null;
          setLoading(false);
        }
      }
    },
    [kind]
  );

  const cancel = useCallback(() => {
    sequence.current++;
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
    setError(null);
  }, []);

  const edit = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);
  return { preview, loading, restoring, error, run, cancel, edit, setError };
};
