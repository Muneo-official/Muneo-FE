import { client } from '../client';
import { type DiagnosisFeedbackRequest } from './types';

export const saveDiagnosisFeedback = async (reportId: string, feedback: DiagnosisFeedbackRequest): Promise<void> => {
  await client.put(`api/v1/risk-detector/${encodeURIComponent(reportId)}/feedback`, { json: feedback });
};
