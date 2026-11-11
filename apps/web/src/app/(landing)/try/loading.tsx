import * as styles from '@/app/(main)/estimate/page.css';

export default function Loading() {
  return (
    <div className={styles.page} aria-busy="true">
      <p role="status" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        체험 화면을 준비하고 있어요.
      </p>
    </div>
  );
}
