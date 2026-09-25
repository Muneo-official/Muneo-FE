import {
  type AnalyticsEvent,
  type AnalyticsEventMap,
  type AuthMethod,
  type CtaEvent,
} from '@/constants/analyticsEvents';
import { type AuthUser } from '@/types/auth';

type EventParamValue = string | number | boolean;

type DataLayerMessage = Record<string, unknown>;

type WindowWithDataLayer = Window & { dataLayer?: DataLayerMessage[] };

// 소셜 가입 티켓은 1회용 인증 수단이라 주소에 실려 있어도 GA로 보내지 않는다.
const SENSITIVE_QUERY_PARAMS = ['ticket'];

// 카카오 로그인은 서버 리다이렉트로 끝나서 성공 시점을 클라이언트가 보지 못한다. 출발할 때 남겨 두고 도착해서 꺼낸다.
const PENDING_SOCIAL_LOGIN_KEY = 'muneo:pending-social-login';

const getDataLayer = (): DataLayerMessage[] | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  // GTM 스크립트는 하이드레이션 이후에 붙는다. 그 전에 쌓인 항목도 GTM이 로드되며 순서대로 처리하므로 큐를 먼저 만든다.
  const w = window as WindowWithDataLayer;
  w.dataLayer ??= [];
  return w.dataLayer;
};

const normalize = (value: unknown): EventParamValue | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
};

export const getPageLocation = (): string => {
  const url = new URL(window.location.href);
  for (const key of SENSITIVE_QUERY_PARAMS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
};

export const trackEvent = <E extends AnalyticsEvent>(event: E, params?: AnalyticsEventMap[E]): void => {
  const dataLayer = getDataLayer();
  if (!dataLayer) {
    return;
  }
  const eventParams: Record<string, EventParamValue> = { page_location: getPageLocation() };
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      const normalized = normalize(value);
      if (normalized !== undefined) {
        eventParams[key] = normalized;
      }
    }
  }
  // GTM은 새 푸시를 기존 값에 병합한다. 먼저 비우지 않으면 앞 이벤트의 파라미터가 다음 이벤트에 그대로 따라붙는다.
  dataLayer.push({ event_params: null });
  dataLayer.push({ event, event_params: eventParams });
};

export interface CtaParams {
  linkText?: string;
  linkUrl?: string;
  position?: 'header' | 'hero' | 'footer' | 'floating' | string;
}

export const trackCtaClick = (event: CtaEvent, params?: CtaParams): void => {
  trackEvent(event, {
    link_text: params?.linkText,
    link_url: params?.linkUrl,
    position: params?.position,
  });
};

// event 없이 넣은 값은 GTM에 남아 이후 모든 이벤트가 읽는다. 로그아웃은 전체 새로고침이라 따로 지우지 않는다.
export const setAnalyticsUser = (user: Pick<AuthUser, 'id' | 'authProvider' | 'role'>): void => {
  getDataLayer()?.push({
    user_id: String(user.id),
    user_auth_provider: user.authProvider.toLowerCase(),
    // 운영자 계정의 사용 기록은 GA4 내부 트래픽 필터로 보고서에서 뺀다.
    traffic_type: user.role === 'ADMIN' ? 'internal' : undefined,
  });
};

const clearPendingSocialLogin = (): void => {
  try {
    sessionStorage.removeItem(PENDING_SOCIAL_LOGIN_KEY);
  } catch {
    // 저장소를 쓸 수 없는 환경이면 남은 값도 없다.
  }
};

export const trackAuth = (event: 'login' | 'sign_up', method: AuthMethod): void => {
  clearPendingSocialLogin();
  trackEvent(event, { method });
};

export const markSocialLoginStart = (method: Exclude<AuthMethod, 'email'>): void => {
  try {
    sessionStorage.setItem(PENDING_SOCIAL_LOGIN_KEY, method);
  } catch {
    // 저장소를 쓸 수 없으면 이 로그인은 집계에서 빠진다.
  }
};

// 소셜 가입은 가입 폼 제출 때 sign_up으로 집계하며 표시를 지우므로, 여기까지 남아 있으면 기존 회원의 로그인이다.
export const trackPendingSocialLogin = (): void => {
  let method: string | null = null;
  try {
    method = sessionStorage.getItem(PENDING_SOCIAL_LOGIN_KEY);
  } catch {
    return;
  }
  if (method === 'kakao') {
    trackAuth('login', method);
  }
};
