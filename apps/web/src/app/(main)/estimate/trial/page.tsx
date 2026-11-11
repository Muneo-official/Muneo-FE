import { redirect } from 'next/navigation';
import { isApiError } from '@/api/errors';
import { getFullEstimateTrial } from '@/api/trial/server';
import { TrialResultUnavailable } from '@/components/TrialResultUnavailable';
import { getLoginHref } from '@/lib/authRedirect';
import { StepIndicator } from '../_components/StepIndicator/StepIndicator';
import * as styles from '../page.css';
import { TrialEstimateReport } from './TrialEstimateReport';

export default async function TrialResultPage() {
  try {
    const trial = await getFullEstimateTrial();
    return (
      <div className={styles.page}>
        <div className={styles.content}>
          <StepIndicator currentStep={4} />
          <TrialEstimateReport trial={trial} />
        </div>
      </div>
    );
  } catch (error) {
    if (!isApiError(error)) {
      throw error;
    }
    if (error.status === 401) {
      redirect(getLoginHref('/estimate/trial'));
    }
    return <TrialResultUnavailable kind="estimate" expired={error.status === 410} />;
  }
}
