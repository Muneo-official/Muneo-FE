import { FileUploadIcon, OctagonCheckIcon, StatusCard, TriangleWarningIcon } from '@muneo/design-system';
import { HeroCtaButton } from './HeroCtaButton';
import { ScrollIndicator } from './ScrollIndicator';
import * as styles from './HeroSection.css';

const RECENT_ANALYSES = [
  '04-15 리스크 진단 주거 32평 A업체 누락 4건',
  '04-14 가견적서 상업 20평',
  '04-12 리스크 진단 주거 28평 B업체 누락 2건',
];

const HEADLINE_ID = 'hero-headline';

export const HeroSection = () => {
  return (
    <section className={styles.section} aria-labelledby={HEADLINE_ID} data-testid="hero-section">
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.left}>
            <h1 id={HEADLINE_ID} className={styles.headline}>
              <span className={styles.headlineLine1}>내 인테리어 견적서,</span>
              <span className={styles.headlineLine2}>AI가 꼼꼼히 검토해드립니다.</span>
            </h1>
            <div className={styles.subContent}>
              <div className={styles.descriptionSection}>
                <p className={styles.descriptionText}>누락된 항목, 과다 청구 항목, 모호한 표현 전부</p>
                <div className={styles.divider} aria-hidden="true" />
                <p className={styles.descriptionText}>계약 전에 문어가 찾아드릴게요</p>
              </div>
              <div className={styles.ctaWrapper}>
                <HeroCtaButton />
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <figure className={styles.previewCard}>
              <div className={styles.previewInner}>
                <div className={styles.previewTop}>
                  <figcaption className={styles.previewLabel}>AI 진단 미리보기</figcaption>
                  <div className={styles.statusCardsRow}>
                    <StatusCard variant="primary" icon={<FileUploadIcon />} label="생성한 가견적서" value="3건" />
                    <StatusCard variant="success" icon={<OctagonCheckIcon />} label="진단 완료한 견적" value="5건" />
                    <StatusCard
                      variant="danger"
                      icon={<TriangleWarningIcon />}
                      label="발견한 리스크 항목"
                      value="12건"
                    />
                  </div>
                </div>
                <div className={styles.recentSection}>
                  <span className={styles.recentLabel}>최근 분석</span>
                  <ul className={styles.recentList}>
                    {RECENT_ANALYSES.map((item) => (
                      <li key={item} className={styles.recentItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </figure>
          </div>
        </div>
        <p className={styles.subHeadline}>가견적서 생성부터 견적서 리스크 진단까지 한 곳에서</p>
      </div>
      <ScrollIndicator />
    </section>
  );
};
