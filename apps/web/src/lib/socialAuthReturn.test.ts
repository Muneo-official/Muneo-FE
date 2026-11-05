import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consumeSocialAuthReturn, readSocialAuthReturn, rememberSocialAuthReturn } from './socialAuthReturn';

describe('소셜 인증 후 선택한 기능으로 복귀', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each(['/analysis', '/estimate'])('선택한 %s 경로를 인증 완료 시 한 번만 사용한다', (path) => {
    rememberSocialAuthReturn(path);
    expect(readSocialAuthReturn()).toBe(path);
    expect(consumeSocialAuthReturn()).toBe(path);
    expect(consumeSocialAuthReturn()).toBe('/home');
  });

  it('이전 선택은 새 인증 시도로 교체한다', () => {
    rememberSocialAuthReturn('/analysis');
    rememberSocialAuthReturn('/estimate');
    expect(consumeSocialAuthReturn()).toBe('/estimate');
  });

  it('만료된 선택은 다음 로그인에 적용하지 않는다', () => {
    rememberSocialAuthReturn('/analysis');
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 31 * 60 * 1000);
    expect(consumeSocialAuthReturn()).toBe('/home');
  });

  it('외부 주소나 손상된 저장값은 홈으로 보낸다', () => {
    rememberSocialAuthReturn('https://example.com');
    expect(consumeSocialAuthReturn()).toBe('/home');
    sessionStorage.setItem('muneo:social-auth-return', '{broken');
    expect(consumeSocialAuthReturn()).toBe('/home');
  });

  it('저장소가 차단되어도 인증 흐름을 중단하지 않는다', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    vi.stubGlobal('sessionStorage', { getItem: blocked, setItem: blocked, removeItem: blocked });
    expect(() => rememberSocialAuthReturn('/analysis')).not.toThrow();
    expect(consumeSocialAuthReturn()).toBe('/home');
  });
});
