export type FeedbackRating = 'good' | 'bad';
export const FEEDBACK_REASONS = {
  good: [
    { value: 'found_risks', label: '놓친 항목을 찾았어요' },
    { value: 'clear_explanation', label: '설명이 이해하기 쉬워요' },
    { value: 'useful_questions', label: '업체에 질문하기 편해요' },
  ],
  bad: [
    { value: 'incorrect_result', label: '진단이 실제와 달라요' },
    { value: 'missing_risks', label: '중요한 항목을 놓쳤어요' },
    { value: 'unclear_explanation', label: '설명이 이해하기 어려워요' },
  ],
} as const;
export type FeedbackReason = (typeof FEEDBACK_REASONS)[FeedbackRating][number]['value'];

/** 2026-10-10 확정 계약. 사용자 식별은 인증 쿠키로만 처리한다. */
export interface DiagnosisFeedbackRequest {
  schema_version: 1;
  rating: FeedbackRating;
  reasons: FeedbackReason[];
  comment: string;
}

export interface DiagnosisFeedback extends DiagnosisFeedbackRequest {
  report_version: string;
  updated_at: string;
}
