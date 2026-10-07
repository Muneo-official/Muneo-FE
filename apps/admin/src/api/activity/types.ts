import { z } from 'zod';

export const ACTIVITY_KINDS = ['estimates', 'risk-reports', 'feedback'] as const;
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];
export const ACTIVITY_LABELS: Record<ActivityKind, string> = {
  estimates: '예상 견적',
  'risk-reports': '견적서 진단',
  feedback: '진단 피드백',
};

export const FEEDBACK_REASON_LABELS: Record<string, string> = {
  found_risks: '놓친 항목을 찾았어요',
  clear_explanation: '설명이 이해하기 쉬워요',
  useful_questions: '업체에 질문하기 편해요',
  incorrect_result: '진단이 실제와 달라요',
  missing_risks: '중요한 항목을 놓쳤어요',
  unclear_explanation: '설명이 이해하기 어려워요',
};

const timestamp = z.string().datetime({ offset: true });
const ownerId = z.union([z.string().regex(/^[1-9]\d*$/), z.number().int().positive()]).transform(String);
const identity = { id: z.string().min(1), user_id: ownerId, created_at: timestamp };
const jsonObject = z.record(z.string(), z.json());

export const savedActivitySchema = z.object({
  ...identity,
  input: jsonObject,
  result: jsonObject,
});

export const feedbackSchema = z.object({
  ...identity,
  report_id: z.string().min(1),
  schema_version: z.literal(1),
  rating: z.enum(['good', 'bad']),
  reasons: z.array(z.string()),
  comment: z.string().max(500),
  updated_at: timestamp,
});

export type SavedActivity = z.infer<typeof savedActivitySchema>;
export type FeedbackActivity = z.infer<typeof feedbackSchema>;
export type UserActivity = SavedActivity | FeedbackActivity;
export type JsonValue = z.infer<ReturnType<typeof z.json>>;

export const activityPageSchema = (kind: ActivityKind) =>
  z.object({
    content: z.array(kind === 'feedback' ? feedbackSchema : savedActivitySchema),
    page: z.number().int().nonnegative(),
    size: z.number().int().positive().max(100),
    totalElements: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
    first: z.boolean(),
    last: z.boolean(),
  });
