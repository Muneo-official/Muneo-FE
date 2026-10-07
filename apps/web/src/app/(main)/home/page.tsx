import { getServerHistory, type EstimateItem, type RiskItem } from '@/api/history';
import { getServerMe } from '@/api/user/server';
import { TransitionLink } from '@/components/TransitionLink';
import { HistoryTable } from './_components/HistoryTable/HistoryTable';
import { type HistoryRow } from './_types/home.types';
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

  return rows;
};

const HomePage = async () => {
  const user = await getServerMe();

  const { estimates, risks } = await getServerHistory(user.id);

  const rows = buildView(estimates, risks);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.greetingSection}>
          <h1 className={styles.greetingTitle}>
            안녕하세요, <span className={styles.greetingName}>{user.name}</span> 님
          </h1>
          <p className={styles.greetingSubtitle}>인테리어 준비, 어디서부터 시작할까요?</p>
        </div>

        <div className={styles.actions}>
          <TransitionLink href="/estimate" className={styles.actionCard}>
            <span className={styles.actionEyebrow}>견적서를 받기 전이라면</span>
            <h2 className={styles.actionTitle}>
              가견적서 생성하기 <span aria-hidden="true">→</span>
            </h2>
            <p className={styles.actionDescription}>우리 집 정보와 원하는 공정을 입력하고 예상 비용 범위를 확인해요.</p>
          </TransitionLink>
          <TransitionLink href="/analysis" className={styles.actionCard}>
            <span className={styles.actionEyebrow}>업체 견적서가 있다면</span>
            <h2 className={styles.actionTitle}>
              견적서 진단하기 <span aria-hidden="true">→</span>
            </h2>
            <p className={styles.actionDescription}>
              견적서를 올리고 누락·불분명·중복 항목과 업체에 물어볼 내용을 확인해요.
            </p>
          </TransitionLink>
        </div>

        <HistoryTable rows={rows} />
      </div>
    </div>
  );
};

export default HomePage;
