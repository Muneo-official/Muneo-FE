import { type AnalysisStatus, type HistoryRow, type RiskStatus } from '../../_types/history.types';
import * as styles from './HistoryTable.css';

interface HistoryTableProps {
  rows: HistoryRow[];
  onRowClick?: (id: string) => void;
}

const COLUMNS = ['번호', '날짜', '분석 유형', '공사 유형', '리스크', '상태'] as const;

const getStatusClass = (status: AnalysisStatus) => {
  if (status === '완료') {
    return styles.statusComplete;
  }
  if (status === '진행중') {
    return styles.statusInProgress;
  }
  return styles.statusPending;
};

const RiskCell = ({ risk }: { risk: RiskStatus }) => {
  if (risk.missing === 0 && risk.unclear === 0) {
    return <span className={styles.riskNone}>—</span>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {risk.missing > 0 && <span className={styles.riskDanger}>누락 {risk.missing}건</span>}
      {risk.unclear > 0 && <span className={styles.riskWarning}>불분명 {risk.unclear}건</span>}
    </div>
  );
};

export const HistoryTable = ({ rows, onRowClick }: HistoryTableProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.tableScroll} role="region" aria-label="분석 이력 목록" tabIndex={0}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colId} />
            <col className={styles.colDate} />
            <col className={styles.colAnalysisType} />
            <col className={styles.colConstructionType} />
            <col className={styles.colRisk} />
            <col className={styles.colStatus} />
          </colgroup>
          <thead className={styles.thead}>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className={styles.th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.emptyRow}>
                  조회된 이력이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={styles.tr}
                  role="button"
                  tabIndex={0}
                  onClick={() => onRowClick?.(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onRowClick?.(row.id);
                    }
                  }}
                >
                  <td className={styles.td}>{idx + 1}</td>
                  <td className={styles.td}>{row.date}</td>
                  <td className={styles.tdAnalysisType}>{row.analysisType}</td>
                  <td className={styles.td}>{row.constructionType}</td>
                  <td className={styles.td}>
                    <RiskCell risk={row.risk} />
                  </td>
                  <td className={styles.td}>
                    <span className={getStatusClass(row.status)}>{row.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
