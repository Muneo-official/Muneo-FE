import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewTransitionRouter } from './useViewTransitionRouter';

const pushMock = vi.fn();
const prefetchMock = vi.fn();
let currentPathname = '/';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    prefetch: prefetchMock,
  }),
  usePathname: () => currentPathname,
}));

/** startViewTransition 목. 콜백을 즉시 실행하고, 콜백이 반환한 Promise를 노출한다. */
const installTransitionMock = (options: { ready?: Promise<void> } = {}) => {
  let callbackPromise: Promise<void> | undefined;
  const ready = options.ready ?? Promise.resolve();
  // unhandled rejection 방지 — 훅이 .catch를 붙이지 못하는 경우까지 테스트가 죽지 않도록.
  ready.catch(() => {});

  const transitionMock = vi.fn((callback: () => void | Promise<void>) => {
    callbackPromise = Promise.resolve(callback() as void | Promise<void>);
    return { ready, finished: Promise.resolve() };
  });

  Object.defineProperty(document, 'startViewTransition', {
    value: transitionMock,
    configurable: true,
  });

  return {
    transitionMock,
    get callbackPromise() {
      return callbackPromise;
    },
  };
};

describe('useViewTransitionRouter', () => {
  beforeEach(() => {
    pushMock.mockClear();
    prefetchMock.mockClear();
    currentPathname = '/';
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'startViewTransition');
    vi.useRealTimers();
  });

  it('startViewTransition 미지원 시 router.push를 직접 호출한다', () => {
    const { result } = renderHook(() => useViewTransitionRouter());
    result.current.push('/foo');
    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/foo');
  });

  it('startViewTransition 지원 시 트랜지션 콜백 내에서 router.push를 호출한다', () => {
    const { transitionMock } = installTransitionMock();

    const { result } = renderHook(() => useViewTransitionRouter());
    result.current.push('/bar');

    expect(transitionMock).toHaveBeenCalledOnce();
    expect(pushMock).toHaveBeenCalledExactlyOnceWith('/bar');
  });

  it('트랜지션 콜백이 반환한 Promise는 pathname이 바뀌기 전까지 resolve되지 않는다', async () => {
    const mock = installTransitionMock();

    const { result, rerender } = renderHook(() => useViewTransitionRouter());
    result.current.push('/home');

    let settled = false;
    void mock.callbackPromise?.then(() => {
      settled = true;
    });

    await Promise.resolve();
    expect(settled).toBe(false);

    // 목적지 route가 커밋된 상황을 흉내낸다.
    currentPathname = '/home';
    rerender();

    await mock.callbackPromise;
    expect(settled).toBe(true);
  });

  it('pathname이 끝내 바뀌지 않아도 상한 시간이 지나면 트랜지션을 종료한다', async () => {
    vi.useFakeTimers();
    const mock = installTransitionMock();

    const { result } = renderHook(() => useViewTransitionRouter());
    result.current.push('/');

    let settled = false;
    void mock.callbackPromise?.then(() => {
      settled = true;
    });

    vi.advanceTimersByTime(2000);
    await vi.runAllTimersAsync();

    expect(settled).toBe(true);
  });

  it('트랜지션이 중단되어 ready가 reject돼도 unhandled rejection 없이 정리된다', async () => {
    const rejectedReady = Promise.reject(new Error('Transition was aborted because of invalid state'));
    const mock = installTransitionMock({ ready: rejectedReady });

    const { result } = renderHook(() => useViewTransitionRouter());
    expect(() => result.current.push('/home')).not.toThrow();

    let settled = false;
    void mock.callbackPromise?.then(() => {
      settled = true;
    });

    // ready reject → 훅이 settlePending으로 콜백 Promise를 resolve해야 한다.
    await new Promise((r) => setTimeout(r, 0));
    expect(settled).toBe(true);
  });

  it('prefetch는 router.prefetch에 위임한다', () => {
    const { result } = renderHook(() => useViewTransitionRouter());
    result.current.prefetch('/baz');
    expect(prefetchMock).toHaveBeenCalledExactlyOnceWith('/baz');
  });
});
