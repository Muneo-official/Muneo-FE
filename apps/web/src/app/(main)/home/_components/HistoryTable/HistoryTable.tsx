'use client';

import { CaretDownSmIcon } from '@muneo/design-system';
import { useRouter } from 'next/navigation';
import { TransitionLink } from '@/components/TransitionLink';
import { type HistoryRow } from '../../_types/home.types';
import * as styles from './HistoryTable.css';

interface HistoryTableProps {
  rows: HistoryRow[];
  onDelete?: (id: string) => void;
}

const COLUMNS = ['날짜', '분석 유형', '공사 유형'] as const;

const formatDate = (dateStr: string) => {
  const [, month, day] = dateStr.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일`;
};

const AnalysisTypeBadge = ({ label }: { label: string }) => {
  const isRisk = label === '리스크 진단';
  return <span className={isRisk ? styles.analysisRisk : styles.analysisEstimate}>{label}</span>;
};

export const HistoryTable = ({ rows, onDelete }: HistoryTableProps) => {
  const router = useRouter();
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          최근 분석 이력
          <span className={styles.cardTitleCount}>{rows.length}</span>
        </h3>
        <TransitionLink href="/history" className={styles.viewAllLink}>
          전체 이력 보기
          <CaretDownSmIcon width={24} height={24} style={{ transform: 'rotate(-90deg)' }} />
        </TransitionLink>
      </div>
      <div className={styles.tableScroll} role="region" aria-label="분석 이력 목록" tabIndex={0}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colDate} />
            <col className={styles.colType} />
            <col className={styles.colConstruction} />
            <col className={styles.colAction} />
          </colgroup>
          <thead className={styles.thead}>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className={styles.th}>
                  {col}
                </th>
              ))}
              <th className={styles.th} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={styles.tr}
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/history/${row.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    router.push(`/history/${row.id}`);
                  }
                }}
              >
                <td className={styles.tdDate}>{formatDate(row.date)}</td>
                <td className={styles.tdType}>
                  <AnalysisTypeBadge label={row.analysisType} />
                </td>
                <td className={styles.tdConstruction}>{row.constructionType}</td>
                <td className={styles.tdAction}>
                  {row.analysisType === '가견적서 생성' && onDelete ? (
                    <button
                      type="button"
                      aria-label="삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#9CA3AF',
                      }}
                    >
                      ✕
                    </button>
                  ) : (
                    <CaretDownSmIcon width={14} height={14} style={{ transform: 'rotate(-90deg)' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
