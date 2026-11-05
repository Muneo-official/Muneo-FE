import { getSafeReturnPath } from './authRedirect';

const STORAGE_KEY = 'muneo:social-auth-return';
const MAX_AGE = 30 * 60 * 1000;

export const rememberSocialAuthReturn = (path: string): void => {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ path: getSafeReturnPath(path), expiresAt: Date.now() + MAX_AGE })
    );
  } catch {
    // 브라우저 저장소가 차단된 경우 기존처럼 홈으로 이동한다.
  }
};

export const readSocialAuthReturn = (): string => {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    if (
      saved &&
      typeof saved === 'object' &&
      'path' in saved &&
      typeof saved.path === 'string' &&
      'expiresAt' in saved &&
      typeof saved.expiresAt === 'number' &&
      saved.expiresAt > Date.now()
    ) {
      return getSafeReturnPath(saved.path);
    }
  } catch {
    // 저장소 접근 실패나 손상된 값은 기본 경로로 처리한다.
  }
  return '/home';
};

export const consumeSocialAuthReturn = (): string => {
  const path = readSocialAuthReturn();
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소가 차단되어도 인증 완료 후 이동은 계속한다.
  }
  return path;
};
