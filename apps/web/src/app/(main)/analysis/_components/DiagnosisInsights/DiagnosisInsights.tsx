'use client';

import { Button } from '@muneo/design-system';
import { useState } from 'react';
import { buildInsights } from '../../_lib/buildInsights';
import { type DiagnosisResult } from '../../_types/analysis.types';
import * as styles from './DiagnosisInsights.css';

export const DiagnosisInsights = ({ result }: { result: DiagnosisResult }) => {
  const { total, priorities, questions } = buildInsights(result);
  const [copyStatus, setCopyStatus] = useState('');
  const [showCopyText, setShowCopyText] = useState(false);

  const copyQuestions = async () => {
    try {
      await navigator.clipboard.writeText(
        `견적서 확인 요청\n\n${questions}\n\n확인한 범위와 금액을 견적서에 반영해 주세요.`
      );
      setCopyStatus('업체에 보낼 질문을 복사했어요.');
    } catch {
      setShowCopyText(true);
      setCopyStatus('아래 질문을 선택해 직접 복사해 주세요.');
    }
  };

  return (
    <section className={styles.card} aria-label="종합 인사이트">
      <div className={styles.header}>
        <span className={styles.eyebrow}>종합 인사이트 · 계약 전 확인 순서</span>
        {total > 0 && (
          <Button variant="outlineSecondary" onClick={copyQuestions}>
            업체에 보낼 질문 복사
          </Button>
        )}
      </div>
      <h2 className={styles.title}>
        {total > 0 ? `${total}개 항목을 업체와 확인해 주세요` : '이번 진단에서 확인이 필요한 항목은 발견되지 않았어요'}
      </h2>
      <p className={styles.description}>
        {total > 0
          ? '누락 → 불분명 → 중복 순으로 먼저 살펴볼 항목이에요. 실제 문제인지는 업체의 설명과 견적서로 확인해 주세요.'
          : '모든 문제가 없다는 보장은 아니에요. 공사 범위·자재 규격·추가 비용 조건을 최종 견적서와 대조해 주세요.'}
      </p>
      {priorities.length > 0 && (
        <ol className={styles.list}>
          {priorities.map((item, index) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.eyebrow}>
                {index + 1}. {item.processName} · {item.status}
              </span>
              <h3 className={styles.itemTitle}>{item.title || '상세 내용 확인'}</h3>
              <p className={styles.description}>{item.question}</p>
              <a
                className={styles.link}
                href={`#diagnosis-item-${item.id}`}
                onClick={() => {
                  const header = document.getElementById(`process-toggle-${item.sectionId}`);
                  if (header?.getAttribute('aria-expanded') === 'false') {
                    header.click();
                  }
                }}
              >
                진단 근거 보기
              </a>
            </li>
          ))}
        </ol>
      )}
      <p className={styles.description}>
        합의한 공사 범위와 금액은 최종 견적서에 남겨 두세요. 이 안내는 진단 항목을 정리한 참고 정보예요.
      </p>
      {copyStatus && (
        <p role="status" className={styles.description}>
          {copyStatus}
        </p>
      )}
      {showCopyText && (
        <textarea
          className={styles.copyText}
          aria-label="업체에 보낼 질문"
          readOnly
          value={questions}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </section>
  );
};
