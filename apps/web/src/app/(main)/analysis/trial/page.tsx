import { redirect } from 'next/navigation';
import { isApiError } from '@/api/errors';
import { getFullAnalysisTrial } from '@/api/trial/server';
import { unlockReveal } from '@/components/Locked/Locked.css';
import { TrialResultUnavailable } from '@/components/TrialResultUnavailable';
import { TrialUnlockedNotice } from '@/components/TrialUnlockedNotice';
import { getLoginHref } from '@/lib/authRedirect';
import { DiagnosisReport } from '../_components/DiagnosisReport/DiagnosisReport';
import * as styles from '../page.css';

export default async function TrialResultPage() {
  try {
    const trial = await getFullAnalysisTrial();
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <TrialUnlockedNotice />
          <DiagnosisReport trial={trial} className={unlockReveal} />
        </div>
      </div>
    );
  } catch (error) {
    if (!isApiError(error)) {
      throw error;
    }
    if (error.status === 401) {
      redirect(getLoginHref('/analysis/trial'));
    }
    return <TrialResultUnavailable kind="analysis" expired={error.status === 410} />;
  }
}
