export const getSafeReturnPath = (value: string | null): string => {
  if (!value || !/^\/(home|estimate|analysis|history|profile)(\/|\?|$)/.test(value)) {
    return '/home';
  }
  if (/[\\\r\n]/.test(value)) {
    return '/home';
  }
  return value;
};

export const getLoginHref = (returnTo: string) => `/login?next=${encodeURIComponent(getSafeReturnPath(returnTo))}`;

export const getSignupHref = (returnTo: string) => `/signup?next=${encodeURIComponent(getSafeReturnPath(returnTo))}`;

export const getCurrentReturnPath = () => getSafeReturnPath(new URLSearchParams(window.location.search).get('next'));
