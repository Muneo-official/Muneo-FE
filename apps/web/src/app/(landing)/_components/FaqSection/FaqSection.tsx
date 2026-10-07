'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { sectionDivider, sectionHeader, sectionSubtitle, sectionTitle } from '../sectionHeader.css';
import * as styles from './FaqSection.css';

const FAQS = [
  {
    id: 1,
    question: '어떤 형식의 견적서를 지원하나요?',
    answer: 'PDF, JPG, PNG 형식의 파일을 지원합니다. 견적서 이미지를 업로드하면 AI가 자동으로 텍스트를 인식합니다.',
  },
  {
    id: 2,
    question: '분석 결과를 얼마나 신뢰할 수 있나요?',
    answer:
      '실제 시장 데이터를 기반으로 학습된 AI가 분석하며, 누락/중복 항목과 같은 시공 도중 추가금이 발생할 수 있을 만한 주요 리스크 항목을 탐지합니다.',
  },
  {
    id: 3,
    question: '서비스 이용 요금은 얼마인가요?',
    answer: '제공하는 기본 기능은 현재 무상으로 제공되고 있습니다.',
  },
  {
    id: 4,
    question: '업로드한 견적서 정보는 안전한가요?',
    answer: '진단에 필요하지 않은 주민등록번호, 연락처, 상세 주소 등은 가린 뒤 업로드해 주세요.',
  },
  {
    id: 5,
    question: '진단 결과는 어떻게 활용하나요?',
    answer:
      '누락·불분명·중복으로 표시된 내용을 업체에 확인하고, 합의한 공사 범위와 비용을 견적서에 반영해 주세요. AI 진단은 확인을 돕는 참고 자료입니다.',
  },
];

const SECTION_TITLE_ID = 'faq-title';

export const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const { ref, inView } = useInView<HTMLElement>();

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" ref={ref} className={styles.section} aria-labelledby={SECTION_TITLE_ID}>
      <div className={styles.container}>
        <div className={clsx(styles.inner, inView && styles.innerVisible)}>
          <header className={sectionHeader}>
            <h2 id={SECTION_TITLE_ID} className={sectionTitle}>
              자주 묻는 질문
            </h2>
            <div className={sectionDivider} aria-hidden="true" />
            <p className={sectionSubtitle}>궁금한 것이 있으신가요?</p>
          </header>
          <ul className={styles.faqList}>
            {FAQS.map(({ id, question, answer }) => {
              const isOpen = openId === id;
              const answerId = `faq-answer-${id}`;
              return (
                <li key={id} className={styles.faqItem}>
                  <h3 className={styles.questionHeading}>
                    <button
                      type="button"
                      className={clsx(styles.faqQuestion, isOpen && styles.faqQuestionActive)}
                      onClick={() => toggle(id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                    >
                      <span className={clsx(styles.questionText, isOpen && styles.questionTextActive)}>{question}</span>
                      <span className={clsx(styles.chevron, isOpen && styles.chevronActive)} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={answerId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    className={clsx(styles.faqAnswer, isOpen && styles.faqAnswerOpen)}
                  >
                    <div className={styles.faqAnswerInner}>
                      <p className={styles.answerText}>{answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
