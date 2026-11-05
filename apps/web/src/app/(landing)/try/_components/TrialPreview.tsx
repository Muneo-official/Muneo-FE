'use client';

import { Button } from '@muneo/design-system';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { type TrialPreview as Preview } from '@/api/trial';
import { PendingLinkLabel } from '@/components/PendingLinkLabel';
import { getLoginHref, getSignupHref } from '@/lib/authRedirect';
import * as styles from './TrialLayout.css';

export const TrialPreview = ({ preview, onEdit }: { preview: Preview; onEdit: () => void }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const path = `/${preview.kind}/trial`;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    titleRef.current?.focus({ preventScroll: true });
  }, []);
  const remaining =
    preview.kind === 'analysis'
      ? Math.max(0, preview.totalItems - 1)
      : Math.max(0, preview.totalProcesses - (preview.firstProcess ? 1 : 0));
  return (
    <>
      <header className={styles.header}>
        <p className={styles.eyebrow}>결과 미리보기</p>
        <h1 className={styles.heading} ref={titleRef} tabIndex={-1}>
          {preview.kind === 'analysis' ? '진단이 완료됐어요' : '가견적서가 완성됐어요'}
        </h1>
        <p className={styles.text}>먼저 한 항목을 확인해 보세요. 로그인하면 나머지 결과를 이어서 볼 수 있어요.</p>
      </header>
      {preview.kind === 'analysis' && (
        <div className={styles.badges}>
          {Object.entries(preview.counts).map(([label, count]) => (
            <span className={styles.badge} key={label}>
              {label} {count}건
            </span>
          ))}
        </div>
      )}
      <div className={styles.resultGrid}>
        <section className={styles.card} aria-label="공개된 결과">
          {preview.kind === 'analysis' ? (
            preview.firstItem ? (
              <>
                <p className={styles.eyebrow}>
                  {preview.firstItem.process} · {preview.firstItem.status}
                </p>
                <h2 className={styles.cardTitle}>{preview.firstItem.title}</h2>
                <p className={styles.text}>{preview.firstItem.description}</p>
                <div className={styles.notice}>
                  <strong>업체에 확인할 질문</strong>
                  <p>{preview.firstItem.guide}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className={styles.cardTitle}>확인할 세부 항목이 없어요</h2>
                <p className={styles.text}>로그인 후 전체 결과와 입력 내용을 확인해 주세요.</p>
              </>
            )
          ) : preview.firstProcess ? (
            <>
              <p className={styles.eyebrow}>선택한 {preview.totalProcesses}개 공정 중 미리보기</p>
              <h2 className={styles.cardTitle}>{preview.firstProcess.name} 공사</h2>
              <p className={styles.heading}>
                {Math.round(preview.firstProcess.min / 10000).toLocaleString('ko-KR')}~
                {Math.round(preview.firstProcess.max / 10000).toLocaleString('ko-KR')}만원
              </p>
              <p className={styles.text}>
                입력하신 조건에 따른 예상 범위예요. 최종 금액은 현장 상태와 업체 견적에 따라 달라질 수 있어요.
              </p>
            </>
          ) : (
            <>
              <h2 className={styles.cardTitle}>참고할 단가가 충분하지 않아요</h2>
              <p className={styles.text}>로그인 후 전체 결과에서 공정별 산출 여부를 확인해 주세요.</p>
            </>
          )}
        </section>
        <section className={styles.gate} aria-labelledby="unlock-title">
          <div className={styles.masked} aria-hidden="true">
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
          <h2 id="unlock-title" className={styles.cardTitle}>
            {remaining > 0
              ? `나머지 ${remaining}개 ${preview.kind === 'analysis' ? '항목' : '공정'}도 확인해 보세요`
              : '전체 결과를 확인하고 저장하세요'}
          </h2>
          <p className={styles.text}>
            로그인하면 전체 내용과 상세 안내를 볼 수 있어요. 입력과 분석을 다시 할 필요는 없어요.
          </p>
          <Button as={Link} href={getLoginHref(path)} variant="gradient">
            <PendingLinkLabel>로그인하고 전체 결과 보기</PendingLinkLabel>
          </Button>
          <Link href={getSignupHref(path)} className={styles.link}>
            처음이신가요? 무료 회원가입
          </Link>
          <p className={styles.small}>
            이 결과는 완료 시점부터 30분 동안 임시 보관돼요. 로그인 후 저장하면 내 분석 이력에서 다시 볼 수 있어요.
          </p>
        </section>
      </div>
      <div className={styles.actions}>
        <Button variant="outlineSecondary" onClick={onEdit}>
          입력 수정하기
        </Button>
        <Link href="/" className={styles.link}>
          홈으로 돌아가기
        </Link>
      </div>
    </>
  );
};
