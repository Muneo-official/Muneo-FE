import { DoneRingRoundFillIcon } from '@muneo/design-system';
import * as styles from './TrialUnlockedNotice.css';

/** 로그인 직후 체험 결과 전체를 열었음을 알린다. */
export const TrialUnlockedNotice = () => (
  <div className={styles.notice} role="status">
    <DoneRingRoundFillIcon width={20} height={20} />
    <p className={styles.text}>
      <strong>잠겨 있던 결과를 모두 열었어요.</strong> 체험에서 만든 결과 그대로예요. 저장하면 분석 이력에서 언제든 다시
      볼 수 있어요.
    </p>
  </div>
);
