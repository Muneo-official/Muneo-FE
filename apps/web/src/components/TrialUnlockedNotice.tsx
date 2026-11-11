import { DoneIcon } from '@muneo/design-system';
import * as styles from './TrialUnlockedNotice.css';

/** 로그인 직후 체험 결과 전체를 열었음을 알린다. */
export const TrialUnlockedNotice = () => (
  <p className={styles.notice} role="status">
    <DoneIcon width={18} height={18} className={styles.icon} aria-hidden="true" />
    <span>
      <strong className={styles.lead}>잠겨 있던 결과를 모두 열었어요.</strong> 저장하면 분석 이력에서 다시 볼 수 있어요.
    </span>
  </p>
);
