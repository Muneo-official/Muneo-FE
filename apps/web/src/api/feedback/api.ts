import { z } from 'zod';
import { client } from '../client';
import { ApiError, toApiError } from '../errors';
import { FEEDBACK_REASONS, type DiagnosisFeedback, type DiagnosisFeedbackRequest } from './types';

const feedbackSchema = z
  .object({
    schema_version: z.literal(1),
    rating: z.enum(['good', 'bad']),
    reasons: z.array(z.enum([...FEEDBACK_REASONS.good, ...FEEDBACK_REASONS.bad].map((reason) => reason.value))).max(3),
    comment: z.string().trim().max(500),
  })
  .refine(
    ({ rating, reasons }) =>
      new Set(reasons).size === reasons.length &&
      reasons.every((reason) => FEEDBACK_REASONS[rating].some((option) => option.value === reason))
  );
const responseSchema = z.object({
  success: z.literal(true),
  result: feedbackSchema.safeExtend({ report_version: z.string().min(1), updated_at: z.string().min(1) }),
});
const feedbackPath = (reportId: string) => `api/v1/risk-detector/${encodeURIComponent(reportId)}/feedback`;

export const getDiagnosisFeedback = async (
  reportId: string,
  signal?: AbortSignal
): Promise<DiagnosisFeedback | null> => {
  try {
    const response = await client.get(feedbackPath(reportId), { signal, cache: 'no-store' });
    if (response.status === 204) {
      return null;
    }
    const parsed = responseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.result.report_version !== reportId) {
      throw new ApiError('INVALID_FEEDBACK_RESPONSE', '저장된 의견의 응답 형식을 확인해 주세요.', 502);
    }
    return parsed.data.result;
  } catch (error) {
    throw toApiError(error);
  }
};

export const saveDiagnosisFeedback = async (reportId: string, feedback: DiagnosisFeedbackRequest): Promise<void> => {
  const parsed = feedbackSchema.safeParse(feedback);
  if (!parsed.success) {
    throw new ApiError('VALIDATION_FAILED', '평가와 선택 이유, 의견 길이를 확인해 주세요.', 400);
  }
  try {
    // 전체 교체 API이므로 빈 필드도 전송한다. 항목별 실제 문제 여부는 수집하지 않는다.
    await client.put(feedbackPath(reportId), { json: { ...parsed.data, item_reviews: [] } });
  } catch (error) {
    throw toApiError(error);
  }
};

export const deleteDiagnosisFeedback = async (reportId: string): Promise<void> => {
  try {
    await client.delete(feedbackPath(reportId));
  } catch (error) {
    throw toApiError(error);
  }
};
