import * as styles from './TrialLayout.css';

export const TrialRestore = () => (
  <section className={styles.loading} role="status">
    <span className={styles.spinner} aria-hidden="true" />
    <p className={styles.text}>이전 체험 결과를 확인하고 있어요.</p>
  </section>
);
