'use client';

import { CaretDownIcon } from '@muneo/design-system';
import { useState } from 'react';
import { type DiagnosisStatus } from '@/api/analyze';
import { type AnalysisPreviewSection } from '@/api/trial';
import { LockedArea, LockIcon } from '@/components/Locked/Locked';
import { DiagnosisItem } from '../DiagnosisItem/DiagnosisItem';
import * as styles from './ProcessSection.css';

const MAX_ROWS = 3;
const STATUS_ORDER = ['누락', '불분명', '중복'] as const;

/** 잠긴 공정의 가짜 항목. 상태 배지 색만 실제 건수에 맞추고 내용은 실제 데이터와 무관하다. */
const buildPlaceholderItems = (section: AnalysisPreviewSection) => {
  const statuses: DiagnosisStatus[] = STATUS_ORDER.flatMap((status) =>
    Array.from({ length: section.counts[status] }, () => status)
  );
  while (statuses.length < Math.min(Math.max(section.itemCount, 1), MAX_ROWS)) {
    statuses.push('정상');
  }
  return statuses.slice(0, MAX_ROWS).map((status, index) => ({
    id: `${section.id}_locked_${index}`,
    status,
    title: '견적서에서 확인이 필요한 항목이에요',
    description: '업체에 확인할 내용과 근거를 정리했어요',
    actionNote: '업체에 이 항목의 범위와 금액을 확인해 보세요',
  }));
};

interface LockedProcessSectionProps {
  section: AnalysisPreviewSection;
  loginHref: string;
}

export const LockedProcessSection = ({ section, loginHref }: LockedProcessSectionProps) => {
  const [open, setOpen] = useState(true);
  const issueCount = section.counts.누락 + section.counts.중복 + section.counts.불분명;

  return (
    <div className={styles.section}>
      <button
        id={`process-toggle-${section.id}`}
        type="button"
        className={styles.sectionHeader}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={`${styles.chevron}${open ? '' : ` ${styles.chevronClosed}`}`}>
          <CaretDownIcon width={14} height={14} />
        </span>
        <span className={styles.sectionName}>{section.display_name}</span>
        <span className={styles.lockedMeta}>
          <LockIcon size={12} />
          {issueCount > 0 ? `확인 필요 ${issueCount}건` : `${section.itemCount}개 항목`}
        </span>
      </button>
      <div
        inert={!open}
        aria-hidden={!open}
        className={`${styles.collapseWrapper}${open ? '' : ` ${styles.collapseWrapperClosed}`}`}
      >
        <div className={styles.itemList}>
          <LockedArea href={loginHref} label={`로그인하고 ${section.display_name} 진단 보기`}>
            <div className={styles.lockedItems}>
              {buildPlaceholderItems(section).map((item) => (
                <DiagnosisItem key={item.id} item={item} />
              ))}
            </div>
          </LockedArea>
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
};
