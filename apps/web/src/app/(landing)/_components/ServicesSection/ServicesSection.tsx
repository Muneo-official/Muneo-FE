'use client';

import { clsx } from 'clsx';
import { Fragment } from 'react';
import { useInView } from '@/hooks/useInView';
import { sectionDivider, sectionHeader, sectionSubtitle, sectionTitle } from '../sectionHeader.css';
import * as styles from './ServicesSection.css';

const SERVICES = [
  {
    number: '01',
    title: '가견적서 생성',
    description: ['시공 조건만 입력하면, 약 1,000개의 실제 시공 데이터를 포함한 견적서를 통해 견적서를 생성합니다. '],
  },
  {
    number: '02',
    title: '리스크진단',
    description: ['견적서의 누락/중복/모호 항목을', 'AI가 자동 탐지합니다'],
  },
];

const DELAYS = [styles.delay1, styles.delay2];

const SECTION_TITLE_ID = 'services-title';

export const ServicesSection = () => {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id="intro" ref={ref} className={styles.section} aria-labelledby={SECTION_TITLE_ID}>
      <div className={styles.container}>
        <div className={clsx(styles.inner, inView && styles.innerVisible)}>
          <header className={sectionHeader}>
            <h2 id={SECTION_TITLE_ID} className={sectionTitle}>
              문어가 제공하는 서비스
            </h2>
            <div className={sectionDivider} aria-hidden="true" />
            <p className={sectionSubtitle}>인테리어 시공의 모든 고민, 문어가 해결해드립니다</p>
          </header>
          <ul className={styles.cardsRow}>
            {SERVICES.map(({ number, title, description }, index) => (
              <li key={number} className={clsx(styles.card, DELAYS[index], inView && styles.cardVisible)}>
                <div className={styles.cardContent}>
                  <p className={styles.cardNumber} aria-hidden="true">
                    {number}
                  </p>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDescription}>
                    {description.map((line, i) => (
                      <Fragment key={line}>
                        {line}
                        {i < description.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
