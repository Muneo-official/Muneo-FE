import { describe, expect, it } from 'vitest';
import { getSafeReturnPath } from './authRedirect';

describe('로그인 후 복귀 주소', () => {
  it.each(['https://example.com', '//example.com', '/\\example.com', '/login', '/home-other', null])(
    '외부 주소와 비허용 경로 %s는 홈으로 보낸다',
    (path) => {
      expect(getSafeReturnPath(path)).toBe('/home');
    }
  );
  it('진단 및 저장 이력 주소를 유지한다', () => {
    expect(getSafeReturnPath('/analysis')).toBe('/analysis');
    expect(getSafeReturnPath('/history/risk-1?from=home')).toBe('/history/risk-1?from=home');
  });
});
