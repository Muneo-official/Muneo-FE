import { Suspense } from 'react';
import { getServerHistory, type EstimateItem, type RiskItem } from '@/api/history';
import { getServerMe } from '@/api/user/server';
import { mapApiReportToDiagnosisResult } from '../analysis/_lib/mapApiReport';
import { HistoryContent } from './_components/HistoryContent/HistoryContent';
import { type AnalysisStatus, type HistoryRow } from './_types/history.types';
import * as styles from './page.css';

const toDate = (iso: string) => iso.slice(0, 10);

const buildHistoryRows = (estimates: EstimateItem[], risks: RiskItem[]): HistoryRow[] => {
  interface Entry {
    createdAt: string;
    row: HistoryRow;
  }

  const estimateEntries: Entry[] = estimates.map((item) => ({
    createdAt: item.created_at,
    row: {
      id: item.id,
      date: toDate(item.created_at),
      analysisType: '가견적서 생성',
      constructionType: `${item.input.공간유형} ${item.input.평수}평`,
      risk: { missing: 0, unclear: 0 },
      status: '완료' as AnalysisStatus,
    },
  }));

  const riskEntries: Entry[] = risks.map((item) => {
    const diagnosis = mapApiReportToDiagnosisResult(item.result.report);
    return {
      createdAt: item.created_at,
      row: {
        id: item.id,
        date: toDate(item.created_at),
        analysisType: '리스크 진단',
        constructionType: `${item.input.space_type} ${item.input.pyeong}평`,
        risk: {
          missing: diagnosis.missingCount,
          unclear: diagnosis.riskCount,
        },
        status: '완료' as AnalysisStatus,
      },
    };
  });

  return [...estimateEntries, ...riskEntries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((entry) => entry.row);
};

const HistoryPage = async () => {
  const user = await getServerMe();
  const { estimates, risks } = await getServerHistory(user.id);
  const rows = buildHistoryRows(estimates, risks);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>분석 이력</h1>
        <Suspense fallback={null}>
          <HistoryContent rows={rows} />
        </Suspense>
      </div>
    </div>
  );
};

export default HistoryPage;
