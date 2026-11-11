import Link from 'next/link';
import { type CSSProperties, type ReactNode } from 'react';
import * as styles from './Locked.css';

export const LockIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    className={styles.icon}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const LOCKED_LABEL = '로그인 후 확인할 수 있어요';

const join = (...names: Array<string | undefined>) => names.filter(Boolean).join(' ');

/**
 * 가려진 글자 자리. 실제 값은 서버가 보내지 않으므로 가짜 글자 대신 글자 높이의 막대만 그린다.
 * 색은 주변 글자색을 옅게 따라가므로 어느 배경에서도 같은 톤으로 보인다.
 */
export const LockedBar = ({ width = '6em', className }: { width?: CSSProperties['width']; className?: string }) => (
  <span className={join(styles.bar, className)} style={{ width }} aria-hidden="true" />
);

/** 잠긴 금액 자리 */
export const LockedValue = ({ width = '7em', className }: { width?: CSSProperties['width']; className?: string }) => (
  <span className={join(styles.value, className)}>
    <LockIcon />
    <LockedBar width={width} />
    <span className={styles.srOnly}>{LOCKED_LABEL}</span>
  </span>
);

interface LockedAreaProps {
  /** 실제 화면과 같은 틀의 빈 자리. 실제 데이터를 넣지 않는다. */
  children: ReactNode;
  href: string;
  label: string;
  className?: string;
}

/** 실제 화면과 같은 틀의 빈 자리와 그 아래 로그인 안내 한 줄. 영역 전체가 로그인 링크다. */
export const LockedArea = ({ children, href, label, className }: LockedAreaProps) => (
  <Link href={href} className={join(styles.area, className)}>
    <span className={styles.placeholder} aria-hidden="true">
      {children}
    </span>
    <span className={styles.label}>
      <LockIcon />
      {label}
    </span>
  </Link>
);
