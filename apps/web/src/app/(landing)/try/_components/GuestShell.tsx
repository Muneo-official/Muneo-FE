'use client';

import { Button, Sidebar, type SidebarNavId } from '@muneo/design-system';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import * as mainStyles from '@/app/(main)/layout.css';
import { useViewTransitionRouter } from '@/hooks/useViewTransitionRouter';
import { getLoginHref, getSignupHref } from '@/lib/authRedirect';
import * as styles from './GuestShell.css';

const TRIAL_PATHS: Partial<Record<SidebarNavId, string>> = { estimate: '/try/estimate', risk: '/try/analysis' };
const MEMBER_PATHS: Partial<Record<SidebarNavId, string>> = { history: '/history', profile: '/profile' };

const ResultPathContext = createContext<(path: string | null) => void>(() => {});

/** 체험 결과가 생기면 사이드바의 로그인·회원가입도 그 결과 화면으로 돌아오게 한다. */
export const useTrialResultPath = (path: string | null) => {
  const setPath = useContext(ResultPathContext);
  useEffect(() => {
    setPath(path);
    return () => setPath(null);
  }, [setPath, path]);
};

/** 로그인 후 화면과 같은 사이드바 레이아웃. 회원 전용 메뉴는 로그인으로 안내한다. */
export const GuestShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { push, prefetch } = useViewTransitionRouter();
  const [resultPath, setResultPath] = useState<string | null>(null);
  const activeItem: SidebarNavId = pathname.startsWith('/try/analysis') ? 'risk' : 'estimate';
  const returnTo = resultPath ?? (activeItem === 'risk' ? '/analysis' : '/estimate');

  const handleItemClick = (id: SidebarNavId) => {
    const trialPath = TRIAL_PATHS[id];
    if (trialPath) {
      push(trialPath);
      return;
    }
    router.push(id === 'home' ? '/' : getLoginHref(MEMBER_PATHS[id] ?? '/home'));
  };

  return (
    <ResultPathContext.Provider value={setResultPath}>
      <div className={mainStyles.wrapper}>
        <Sidebar
          className={mainStyles.sidebar}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          onItemHover={(id) => {
            const trialPath = TRIAL_PATHS[id];
            if (trialPath) {
              prefetch(trialPath);
            }
          }}
          accountSlot={
            <div className={styles.account}>
              <p className={styles.accountText}>로그인하면 결과를 저장하고 언제든 다시 볼 수 있어요</p>
              <div className={styles.accountActions}>
                <Button
                  as={Link}
                  href={getLoginHref(returnTo)}
                  variant="primary"
                  size="sm"
                  className={styles.accountButton}
                >
                  로그인
                </Button>
                <Button
                  as={Link}
                  href={getSignupHref(returnTo)}
                  variant="outlineSecondary"
                  size="sm"
                  className={styles.accountButton}
                >
                  회원가입
                </Button>
              </div>
            </div>
          }
        />
        <main className={mainStyles.main}>{children}</main>
      </div>
    </ResultPathContext.Provider>
  );
};
