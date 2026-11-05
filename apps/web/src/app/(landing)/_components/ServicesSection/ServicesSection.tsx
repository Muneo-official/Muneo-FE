import { sectionDivider, sectionHeader, sectionSubtitle, sectionTitle } from '../sectionHeader.css';
import * as styles from './ServicesSection.css';

const SERVICES = [
  {
    number: '01',
    title: '가견적서 생성',
    description:
      '공간과 시공 조건을 입력하면 참고할 수 있는 예상 견적을 만들어요. 업체 상담 전, 필요한 공사와 예산 범위를 정리해 보세요.',
  },
  {
    number: '02',
    title: '견적서 리스크 진단',
    description:
      '받은 견적서의 누락·중복·불명확한 항목을 살펴봐요. 추가 비용이 생길 수 있는 부분과 업체에 확인할 질문을 정리해드려요.',
  },
];

export const ServicesSection = () => (
  <section id="intro" className={styles.section} aria-labelledby="services-title">
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={sectionHeader}>
          <h2 id="services-title" className={sectionTitle}>
            준비부터 검토까지, 필요한 도움을 골라보세요
          </h2>
          <div className={sectionDivider} aria-hidden="true" />
          <p className={sectionSubtitle}>견적서가 없어도, 이미 받았어도 시작할 수 있어요</p>
        </header>
        <ul className={styles.cardsRow}>
          {SERVICES.map(({ number, title, description }) => (
            <li key={number} className={styles.card}>
              <div className={styles.cardContent}>
                <p className={styles.cardNumber} aria-hidden="true">
                  {number}
                </p>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
