import { type ReactNode } from 'react';
import * as styles from './TrialNotice.css';

/** 입력 화면 맨 위의 한 줄 체험 안내. 실제 서비스 화면과 다른 점은 이 안내 하나뿐이다. */
export const TrialNotice = ({ children }: { children: ReactNode }) => (
  <p className={styles.notice} role="note">
    <strong className={styles.lead}>로그인 없이 체험 중이에요.</strong> {children}
  </p>
);
