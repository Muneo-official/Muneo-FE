import { DellSquareIcon, DoneRingRoundFillIcon, SadIcon, vars } from '@muneo/design-system';
import { getServerHistory, type EstimateItem, type RiskItem } from '@/api/history';
import { getServerMe } from '@/api/user/server';
import { HistoryTable } from './_components/HistoryTable/HistoryTable';
import { SummaryCard } from './_components/SummaryCard/SummaryCard';
import { type HistoryRow, type SummaryStats } from './_types/home.types';
import * as styles from './page.css';

const toDate = (isoStr: string) => isoStr.slice(0, 10);

interface HistoryEntry {
  createdAt: string;
  row: HistoryRow;
}

const buildView = (estimates: EstimateItem[], risks: RiskItem[]) => {
  const estimateEntries: HistoryEntry[] = estimates.map((item) => ({
    createdAt: item.created_at,
    row: {
      id: item.id,
      date: toDate(item.created_at),
      analysisType: '가견적서 생성',
      constructionType: `${item.input.공간유형} ${item.input.평수}평 (${item.input.공종.join(', ')})`,
      vendor: null,
    },
  }));

  const riskEntries: HistoryEntry[] = risks.map((item) => ({
    createdAt: item.created_at,
    row: {
      id: item.id,
      date: toDate(item.created_at),
      analysisType: '리스크 진단',
      constructionType: `${item.input.space_type} ${item.input.pyeong}평`,
      vendor: item.input.company_name,
    },
  }));

  const rows = [...estimateEntries, ...riskEntries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)
    .map((entry) => entry.row);

  const stats: SummaryStats = {
    estimateCount: estimates.length,
    diagnosedCount: risks.length,
    riskCount: risks.filter((r) => r.result.report.summary.total_risk_items > 0).length,
  };

  return { stats, rows };
};

const HomePage = async () => {
  const user = await getServerMe();

  const { estimates, risks } = await getServerHistory(user.id);

  const { stats, rows } = buildView(estimates, risks);

  const SUMMARY_CARDS = [
    {
      icon: <DellSquareIcon width={22} height={22} style={{ color: vars.color.brand.secondary }} />,
      label: '그동안 생성한 가견적서',
      count: stats.estimateCount,
    },
    {
      icon: <DoneRingRoundFillIcon width={22} height={22} />,
      label: '진단 완료한 견적',
      count: stats.diagnosedCount,
    },
    {
      icon: <SadIcon width={22} height={22} />,
      label: '리스크 발생 견적',
      count: stats.riskCount,
      danger: true as const,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.greetingSection}>
          <h1 className={styles.greetingTitle}>
            안녕하세요, <span className={styles.greetingName}>{user.name}</span> 님
          </h1>
          <p className={styles.greetingSubtitle}>오늘도 문어와 함께 현명한 의사 결정을 내리세요.</p>
        </div>

        <div className={styles.summaryRow}>
          {SUMMARY_CARDS.map((props) => (
            <SummaryCard key={props.label} {...props} />
          ))}
        </div>

        <HistoryTable rows={rows} />
      </div>
    </div>
  );
};

export default HomePage;
