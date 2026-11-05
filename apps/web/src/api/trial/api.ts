import { type EstimateGenerateRequest } from '@/api/estimate';
import { type TrialKind, type TrialPreview } from './types';

export class TrialApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

const request = async (kind: TrialKind, options: RequestInit): Promise<TrialPreview | null> => {
  const response = await fetch(`/api/v1/trials/${kind}`, { ...options, credentials: 'same-origin', cache: 'no-store' });
  if (response.status === 204) {
    return null;
  }
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new TrialApiError(
      response.status,
      body?.message ?? body?.detail ?? '잠시 연결이 원활하지 않아요. 다시 시도해 주세요.'
    );
  }
  return body as TrialPreview;
};

export const getTrialPreview = (kind: TrialKind, signal: AbortSignal) => request(kind, { signal });
export const analyzeTrial = (body: FormData, signal: AbortSignal) =>
  request('analysis', { method: 'POST', body, signal });
export const generateTrialEstimate = (body: EstimateGenerateRequest, signal: AbortSignal) =>
  request('estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
