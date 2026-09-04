'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

interface ViewTransition {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
};

/**
 * 목적지 렌더가 끝내 커밋되지 않아도(같은 경로로 push, 미들웨어 리다이렉트 등)
 * 화면이 얼어붙지 않도록 트랜지션을 강제로 종료시키는 상한(ms).
 */
const NAVIGATION_TIMEOUT_MS = 2000;

export const useViewTransitionRouter = () => {
  const router = useRouter();
  const pathname = usePathname();

  // startViewTransition 콜백이 반환한 Promise의 resolve. 네비게이션이 커밋되면 호출한다.
  const pendingResolveRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settlePending = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const resolve = pendingResolveRef.current;
    pendingResolveRef.current = null;
    resolve?.();
  }, []);

  // pathname이 바뀌면(목적지 route가 커밋되면) 대기 중인 트랜지션을 종료해 실제 전환 애니메이션을 태운다.
  useEffect(() => {
    settlePending();
  }, [pathname, settlePending]);

  // 언마운트 시 남은 타이머 정리.
  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const push = useCallback(
    (href: string) => {
      const doc = document as ViewTransitionDocument;

      if (typeof doc.startViewTransition !== 'function') {
        router.push(href);
        return;
      }

      // 직전 트랜지션이 아직 대기 중이면(빠른 연속 클릭 등) 먼저 풀어준다.
      settlePending();

      const transition = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pendingResolveRef.current = resolve;
            timeoutRef.current = setTimeout(settlePending, NAVIGATION_TIMEOUT_MS);
            router.push(href);
          })
      );

      // 스트리밍 네비게이션(Suspense·RSC) 도중 트랜지션이 중단되면 ready가 reject되며
      // "InvalidStateError: Transition was aborted"가 unhandled rejection으로 뜬다. 조용히 정리한다.
      transition.ready.catch(() => {
        settlePending();
      });
    },
    [router, settlePending]
  );

  const prefetch = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router]
  );

  return { push, prefetch };
};
