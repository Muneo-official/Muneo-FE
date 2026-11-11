import Link from 'next/link';
import { type ReactNode } from 'react';
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

/**
 * 잠긴 금액·텍스트 자리. 실제 값은 서버가 보내지 않으므로 화면에서 만든 가짜 값을 흐리게 보여준다.
 */
export const LockedValue = ({ placeholder, className }: { placeholder: string; className?: string }) => (
  <span className={[styles.value, className].filter(Boolean).join(' ')}>
    <LockIcon />
    <span className={styles.blurred} aria-hidden="true">
      {placeholder}
    </span>
    <span className={styles.srOnly}>{LOCKED_LABEL}</span>
  </span>
);

interface LockedAreaProps {
  /** 흐리게 보여줄 가짜 내용. 실제 데이터를 넣지 않는다. */
  children: ReactNode;
  href: string;
  label: string;
  className?: string;
}

/** 실제 화면 구성을 흐리게 깔고 그 위에 로그인 버튼을 띄운다. */
export const LockedArea = ({ children, href, label, className }: LockedAreaProps) => (
  <div className={[styles.area, className].filter(Boolean).join(' ')}>
    <div className={styles.blurred} aria-hidden="true" inert>
      {children}
    </div>
    <div className={styles.overlay}>
      <Link href={href} className={styles.unlockLink}>
        <LockIcon />
        {label}
      </Link>
    </div>
  </div>
);
