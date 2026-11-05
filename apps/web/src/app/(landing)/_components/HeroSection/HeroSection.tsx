import { TriangleWarningIcon } from '@muneo/design-system';
import Link from 'next/link';
import { ScrollIndicator } from './ScrollIndicator';
import { StartActions } from '../StartActions/StartActions';
import * as styles from './HeroSection.css';

export const HeroSection = () => (
  <section className={styles.section} aria-labelledby="hero-headline" data-testid="hero-section">
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>계약 전 확인하는 인테리어 견적</p>
          <h1 id="hero-headline" className={styles.headline}>
            <span>내 인테리어 견적서,</span>
            <span className={styles.headlineAccent}>놓친 항목은 없을까요?</span>
          </h1>
          <p className={styles.description}>
            AI가 누락·중복·불명확한 항목을 살펴보고,
            <br />
            업체에 확인할 내용을 정리해드려요.
          </p>
          <StartActions position="hero" />
        </div>
        <figure className={styles.previewCard}>
          <figcaption className={styles.previewHeader}>
            <span>문어의 진단은 이렇게 보여요</span>
            <span className={styles.exampleBadge}>예시</span>
          </figcaption>
          <div className={styles.document}>
            <span className={styles.documentLabel}>견적서에 적힌 내용</span>
            <p className={styles.documentTitle}>철거 공사</p>
            <p className={styles.documentText}>기존 마감재 철거 및 현장 정리</p>
          </div>
          <div className={styles.finding}>
            <span className={styles.findingLabel}>
              <TriangleWarningIcon width={18} height={18} aria-hidden="true" />
              누락 확인 필요
            </span>
            <h2 className={styles.findingTitle}>폐기물 처리비가 포함되어 있나요?</h2>
            <p className={styles.findingText}>
              철거 후 발생하는 폐기물의 반출·처리 비용이 명시되어 있지 않아요. 별도 비용이 발생하는지 확인해 보세요.
            </p>
          </div>
          <div className={styles.question}>
            <span className={styles.questionLabel}>업체에는 이렇게 물어보세요</span>
            <p>“폐기물 운반과 처리 비용까지 포함된 금액인가요?”</p>
          </div>
          <div className={styles.previewFooter}>
            <p>이해를 돕기 위한 예시이며, 실제 진단 결과는 견적서에 따라 달라요.</p>
            <Link href="/preview/diagnosis" className={styles.previewLink}>
              가입 없이 결과 예시 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </figure>
      </div>
      <p className={styles.subHeadline}>가견적서 생성부터 견적서 리스크 진단까지 한 곳에서</p>
    </div>
    <ScrollIndicator />
  </section>
);
