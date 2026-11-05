'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { sectionDivider, sectionHeader, sectionSubtitle, sectionTitle } from '../sectionHeader.css';
import * as styles from './FaqSection.css';

const FAQS = [
  {
    id: 1,
    question: '어떤 형식의 견적서를 지원하나요?',
    answer:
      'PDF, JPG, PNG 이미지와 CSV, Excel 파일을 업로드할 수 있어요. 글자와 금액이 선명하게 보이는 견적서를 준비해 주세요.',
  },
  {
    id: 2,
    question: '분석 결과를 얼마나 신뢰할 수 있나요?',
    answer:
      'AI가 견적서의 누락·중복·불명확한 항목을 찾아 확인을 도와드려요. 모든 문제를 발견하거나 가격의 적정성을 확정하는 것은 아니에요. 표시된 내용은 업체와 확인한 뒤 계약에 반영해 주세요.',
  },
  {
    id: 3,
    question: '서비스 이용 요금은 얼마인가요?',
    answer:
      '현재 가견적서 생성과 견적서 리스크 진단의 기본 기능은 무료예요. 로그인 없이 입력하고 결과 일부를 먼저 볼 수 있어요. 전체 결과 확인과 이력 저장은 로그인 후 이용할 수 있어요.',
  },
  {
    id: 4,
    question: '업로드한 견적서는 어떻게 처리되나요?',
    answer:
      '업로드한 견적서와 추출 내용은 요청한 진단과 결과 조회에 사용돼요. 파일·진단 결과의 보관 기간과 탈퇴 후 삭제 범위는 현재 확인 중이며, 분석 직후 자동 삭제를 보장하지 않아요. 삭제 요청 방법은 개인정보 처리방침에서 확인할 수 있어요. 업로드 전 주민등록번호·연락처·상세 주소 등 진단에 불필요한 정보는 가려 주세요.',
    link: { href: '/privacy', label: '개인정보 처리방침 확인하기' },
  },
  {
    id: 5,
    question: '진단 결과는 어떻게 활용하나요?',
    answer:
      '확인이 필요한 항목과 질문을 업체에 전달해 보세요. 합의한 공사 범위와 비용을 견적서에 반영하고, 진단 결과를 저장해 다시 확인할 수 있어요. AI 진단은 의사결정을 돕는 참고 자료예요.',
  },
];

const SECTION_TITLE_ID = 'faq-title';

export const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className={styles.section} aria-labelledby={SECTION_TITLE_ID}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={sectionHeader}>
            <h2 id={SECTION_TITLE_ID} className={sectionTitle}>
              자주 묻는 질문
            </h2>
            <div className={sectionDivider} aria-hidden="true" />
            <p className={sectionSubtitle}>시작하기 전에 궁금한 내용을 확인하세요</p>
          </header>
          <ul className={styles.faqList}>
            {FAQS.map(({ id, question, answer, link }) => {
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
                      <div className={styles.answerText}>
                        <p>{answer}</p>
                        {link && (
                          <Link href={link.href} className={styles.policyLink}>
                            {link.label}
                          </Link>
                        )}
                      </div>
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
