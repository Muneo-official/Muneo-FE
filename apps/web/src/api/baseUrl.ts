export const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  }
  return apiBaseUrl.replace(/\/$/, '');
};

// 브라우저 요청은 Next.js 프록시(app/api/[...path])를 경유한다.
// 로컬 http 환경에서 Secure·SameSite=None 세션 쿠키가 저장되지 않는 문제를 프록시가 Set-Cookie rewrite로 해결한다.
export const getClientApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return getApiBaseUrl();
};
