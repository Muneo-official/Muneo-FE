import { redirect } from 'next/navigation';
import { isApiError } from '@/api/errors';
import { getFullAnalysisTrial } from '@/api/trial/server';
import { TrialResultUnavailable } from '@/components/TrialResultUnavailable';
import { getLoginHref } from '@/lib/authRedirect';
import { DiagnosisReport } from '../_components/DiagnosisReport/DiagnosisReport';

export default async function TrialResultPage() {
  try {
    const trial = await getFullAnalysisTrial();
    return <DiagnosisReport trial={trial} />;
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
