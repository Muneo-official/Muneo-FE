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
