import { redirect } from 'next/navigation';
import { isApiError } from '@/api/errors';
import { getFullEstimateTrial } from '@/api/trial/server';
import { TrialResultUnavailable } from '@/components/TrialResultUnavailable';
import { getLoginHref } from '@/lib/authRedirect';
import { TrialEstimateReport } from './TrialEstimateReport';

export default async function TrialResultPage() {
  try {
    const trial = await getFullEstimateTrial();
    return <TrialEstimateReport trial={trial} />;
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
