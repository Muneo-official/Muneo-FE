import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getPageLocation,
  markSocialLoginStart,
  setAnalyticsUser,
  trackAuth,
  trackCtaClick,
  trackEvent,
  trackPendingSocialLogin,
} from './analytics';

type DataLayerEntry = Record<string, unknown>;

type TestWindow = Window & { dataLayer?: DataLayerEntry[] };

const dataLayer = (): DataLayerEntry[] => (window as TestWindow).dataLayer ?? [];

const events = () => dataLayer().filter((entry) => typeof entry.event === 'string');

describe('analytics', () => {
  beforeEach(() => {
    delete (window as TestWindow).dataLayer;
    sessionStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  describe('trackEvent', () => {
    it('GTM이 로드되기 전에도 dataLayer를 만들어 이벤트를 쌓는다', () => {
      trackEvent('chat_message_send');

      expect(events()).toHaveLength(1);
      expect(events()[0]).toMatchObject({ event: 'chat_message_send' });
    });

    it('앞 이벤트의 파라미터가 섞이지 않도록 event_params를 비운 뒤 푸시한다', () => {
      trackEvent('login', { method: 'email' });
      trackEvent('estimate_step_complete', { step: 2 });

      expect(dataLayer()).toEqual([
        { event_params: null },
        { event: 'login', event_params: { page_location: 'http://localhost:3000/', method: 'email' } },
        { event_params: null },
        { event: 'estimate_step_complete', event_params: { page_location: 'http://localhost:3000/', step: 2 } },
      ]);
    });

    it('값이 없는 파라미터는 빼고 보낸다', () => {
      trackEvent('page_view', { page_title: '문어', page_referrer: undefined });

      expect(events()[0].event_params).toEqual({ page_location: 'http://localhost:3000/', page_title: '문어' });
    });
  });

  describe('getPageLocation', () => {
    it('소셜 가입 티켓은 주소에서 지운다', () => {
      window.history.replaceState(null, '', '/auth/callback/signup?ticket=secret&from=kakao');

      expect(getPageLocation()).toBe('http://localhost:3000/auth/callback/signup?from=kakao');
    });

    it('민감한 파라미터가 없으면 주소를 그대로 둔다', () => {
      window.history.replaceState(null, '', '/history?type=estimate&from=2026-01-01');

      expect(getPageLocation()).toBe('http://localhost:3000/history?type=estimate&from=2026-01-01');
    });
  });

  describe('trackCtaClick', () => {
    it('camelCase 파라미터를 GA4 파라미터 이름으로 바꿔 보낸다', () => {
      trackCtaClick('click_cta_landing_hero_signup', { linkText: '시작하기', linkUrl: '/login', position: 'hero' });

      expect(events()[0]).toEqual({
        event: 'click_cta_landing_hero_signup',
        event_params: {
          page_location: 'http://localhost:3000/',
          link_text: '시작하기',
          link_url: '/login',
          position: 'hero',
        },
      });
    });
  });

  describe('setAnalyticsUser', () => {
    it('user_id와 가입 경로를 이벤트 없이 푸시한다', () => {
      setAnalyticsUser({ id: 42, authProvider: 'KAKAO', role: 'USER' });

      expect(dataLayer()).toEqual([{ user_id: '42', user_auth_provider: 'kakao', traffic_type: undefined }]);
    });

    it('운영자 계정은 내부 트래픽으로 표시한다', () => {
      setAnalyticsUser({ id: 1, authProvider: 'LOCAL', role: 'ADMIN' });

      expect(dataLayer()[0]).toMatchObject({ traffic_type: 'internal' });
    });
  });

  describe('소셜 로그인 집계', () => {
    it('카카오로 떠났다가 돌아오면 login 이벤트를 한 번만 보낸다', () => {
      markSocialLoginStart('kakao');

      trackPendingSocialLogin();
      trackPendingSocialLogin();

      expect(events()).toHaveLength(1);
      expect(events()[0].event_params).toMatchObject({ method: 'kakao' });
    });

    it('소셜 가입으로 끝나면 sign_up만 보내고 login은 보내지 않는다', () => {
      markSocialLoginStart('kakao');
      trackAuth('sign_up', 'kakao');

      trackPendingSocialLogin();

      expect(events().map((entry) => entry.event)).toEqual(['sign_up']);
    });

    it('카카오를 시도했다가 이메일로 로그인하면 이메일 로그인만 남는다', () => {
      markSocialLoginStart('kakao');
      trackAuth('login', 'email');

      trackPendingSocialLogin();

      expect(events()).toHaveLength(1);
      expect(events()[0].event_params).toMatchObject({ method: 'email' });
    });
  });
});
