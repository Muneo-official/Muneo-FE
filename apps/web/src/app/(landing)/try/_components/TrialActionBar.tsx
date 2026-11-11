import { type ReactNode } from 'react';
import * as styles from './TrialActionBar.css';

interface TrialActionBarProps {
  title: string;
  children: ReactNode;
}

/** 체험 결과 맨 아래 버튼 줄. 잠긴 내용과 로그인하면 어떻게 되는지를 버튼 옆에 짧게 적는다. */
export const TrialActionBar = ({ title, children }: TrialActionBarProps) => (
  <div className={styles.bar}>
    <div className={styles.copy}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>로그인하면 다시 분석하지 않고 이어서 보여드려요. 결과는 30분 동안 보관돼요.</p>
    </div>
    <div className={styles.actions}>{children}</div>
  </div>
);
