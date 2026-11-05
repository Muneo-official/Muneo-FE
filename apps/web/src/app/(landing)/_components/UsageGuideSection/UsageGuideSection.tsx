import { sectionDivider, sectionHeader, sectionSubtitle, sectionTitle } from '../sectionHeader.css';
import * as styles from './UsageGuideSection.css';

const GUIDES = [
  {
    title: '받은 견적서를 확인하고 싶다면',
    label: '견적서 리스크 진단',
    steps: [
      { title: '견적서 업로드', description: '로그인 없이, 불필요한 개인정보를 가린 견적서를 올려 주세요.' },
      { title: '진단 결과 확인', description: '진단이 끝나면 발견된 항목과 확인할 질문 일부를 먼저 살펴보세요.' },
      { title: '업체와 확인', description: '로그인해 전체 결과를 확인하고, 정리된 질문으로 업체와 상담하세요.' },
    ],
  },
  {
    title: '아직 견적서를 받기 전이라면',
    label: '가견적서 생성',
    steps: [
      { title: '공간 정보 입력', description: '로그인 없이 공간 유형과 면적 등 기본 정보를 알려 주세요.' },
      { title: '시공 조건 선택', description: '원하는 공정과 공사 조건을 선택해 예상 견적을 만들어 보세요.' },
      { title: '상담 준비', description: '한 공정의 예상 비용을 먼저 보고, 로그인해 전체 가견적을 확인하세요.' },
    ],
  },
];

export const UsageGuideSection = () => (
  <section id="guide" className={styles.section} aria-labelledby="usage-guide-title">
    <div className={styles.container}>
      <header className={sectionHeader}>
        <h2 id="usage-guide-title" className={sectionTitle}>
          지금 상황에 맞게, 세 단계면 돼요
        </h2>
        <div className={sectionDivider} aria-hidden="true" />
        <p className={sectionSubtitle}>어디서 시작하든 다음에 할 일을 알 수 있도록</p>
      </header>
      <div className={styles.guides}>
        {GUIDES.map(({ title, label, steps }) => (
          <div key={label} className={styles.guide}>
            <p className={styles.label}>{label}</p>
            <h3 className={styles.guideTitle}>{title}</h3>
            <ol className={styles.steps}>
              {steps.map(({ title: stepTitle, description }, index) => (
                <li key={stepTitle} className={styles.step}>
                  <span className={styles.number} aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className={styles.stepTitle}>{stepTitle}</h4>
                    <p className={styles.description}>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <p className={styles.note}>가견적과 AI 진단은 참고 자료예요. 최종 공사 범위와 금액은 업체와 확인해 주세요.</p>
    </div>
  </section>
);
