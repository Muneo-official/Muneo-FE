// GA4로 보내는 이벤트 사전. 이벤트를 추가하면 docs/analytics/README.md의 이벤트 표와 GTM 트리거 정규식도 함께 고친다.

export const CTA_EVENTS = {
  landingHeaderSignup: 'click_cta_landing_header_signup',
  landingHeroSignup: 'click_cta_landing_hero_signup',
  chatOpen: 'click_cta_chat_open',
  chatLoginRedirect: 'click_cta_chat_login_redirect',
} as const;

export type CtaEvent = (typeof CTA_EVENTS)[keyof typeof CTA_EVENTS];

export type AuthMethod = 'email' | 'kakao';

interface CtaEventParams {
  link_text?: string;
  link_url?: string;
  position?: string;
}

// 키는 GA4 이벤트 이름, 값은 event_params로 함께 보내는 파라미터다. page_location은 모든 이벤트에 자동으로 붙는다.
export type AnalyticsEventMap = {
  page_view: { page_title?: string; page_referrer?: string };
  login: { method: AuthMethod };
  sign_up: { method: AuthMethod };
  estimate_step_complete: { step: number };
  estimate_generate_success: { process_count: number };
  estimate_generate_error: { process_count: number };
  analysis_submit_success: { file_count: number };
  analysis_submit_error: { file_count: number };
  chat_message_send: Record<string, never>;
} & Record<CtaEvent, CtaEventParams>;

export type AnalyticsEvent = keyof AnalyticsEventMap;
