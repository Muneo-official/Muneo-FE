import * as styles from './_components/TrialLayout.css';
export default function Loading() {
  return (
    <main className={styles.page} aria-busy="true">
      <p role="status">체험 화면을 준비하고 있어요.</p>
      <div className={styles.card}>
        <span className={styles.skeleton} />
        <span className={styles.skeleton} />
      </div>
    </main>
  );
}
