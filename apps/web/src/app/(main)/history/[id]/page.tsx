import { ArrowLeftMdIcon } from '@muneo/design-system';
import { notFound } from 'next/navigation';
import { getServerHistory } from '@/api/history';
import { getServerMe } from '@/api/user/server';
import { TransitionLink } from '@/components/TransitionLink';
import { mapApiReportToDiagnosisResult } from '../../analysis/_lib/mapApiReport';
import { EstimateResultView } from '../../estimate/_components/EstimateResultView/EstimateResultView';
import { DiagnosisDetailView } from '../_components/DiagnosisDetailView/DiagnosisDetailView';
import * as styles from './page.css';

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getServerMe();

  const { estimates, risks } = await getServerHistory(user.id);

  const estimate = estimates.find((e) => e.id === id);
  if (estimate) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <TransitionLink href="/history" className={styles.backButton}>
            <ArrowLeftMdIcon width={16} height={16} />
            분석 이력
          </TransitionLink>
          <div className={styles.content}>
            <EstimateResultView input={estimate.input} result={estimate.result} />
          </div>
        </div>
      </div>
    );
  }

  const risk = risks.find((r) => r.id === id);
  if (risk) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <TransitionLink href="/history" className={styles.backButton}>
            <ArrowLeftMdIcon width={16} height={16} />
            분석 이력
          </TransitionLink>
          <div className={styles.content}>
            <DiagnosisDetailView result={mapApiReportToDiagnosisResult(risk.result.report, risk.created_at)} />
          </div>
        </div>
      </div>
    );
  }

  return notFound();
}
