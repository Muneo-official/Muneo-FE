import Link from 'next/link';
import { StartActions } from '../StartActions/StartActions';
import * as styles from './StartSection.css';

export const StartSection = () => (
  <section id="start" className={styles.section} aria-labelledby="start-title">
    <div className={styles.container}>
      <p className={styles.eyebrow}>계약 전, 한 번 더 확인하세요</p>
      <h2 id="start-title" className={styles.title}>
        내 시공의 첫 단계부터, 문어와 함께
      </h2>
      <p className={styles.description}>견적서를 준비하는 순간부터 업체에 확인할 질문까지 도와드릴게요.</p>
      <StartActions position="bottom" />
      <p className={styles.loginNote}>
        이미 회원이신가요? <Link href="/login">로그인하기</Link>
      </p>
    </div>
  </section>
);
