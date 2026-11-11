'use client';

import { CaretDownIcon } from '@muneo/design-system';
import { useState } from 'react';
import { type DiagnosisStatus } from '@/api/analyze';
import { type AnalysisPreviewSection } from '@/api/trial';
import { LockedArea, LockIcon } from '@/components/Locked/Locked';
import { DiagnosisItemPlaceholder } from '../DiagnosisItem/DiagnosisItem';
import * as styles from './ProcessSection.css';

const MAX_ROWS = 3;
const STATUS_ORDER = ['누락', '불분명', '중복'] as const;

/** 잠긴 공정의 빈 자리 상태. 실제 건수 순서대로 배지를 채우고 최대 3줄만 그린다. */
const placeholderStatuses = (section: AnalysisPreviewSection): DiagnosisStatus[] => {
  const statuses: DiagnosisStatus[] = STATUS_ORDER.flatMap((status) =>
    Array.from({ length: section.counts[status] }, () => status)
  );
  while (statuses.length < Math.min(Math.max(section.itemCount, 1), MAX_ROWS)) {
    statuses.push('정상');
  }
  return statuses.slice(0, MAX_ROWS);
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
              {placeholderStatuses(section).map((status, index) => (
                <DiagnosisItemPlaceholder key={`${status}-${index}`} status={status} />
              ))}
            </div>
          </LockedArea>
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
};
