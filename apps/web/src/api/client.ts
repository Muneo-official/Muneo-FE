import ky, { HTTPError, type KyInstance } from 'ky';
import { getLoginHref } from '@/lib/authRedirect';
import { isServiceUnavailableStatus, notifyServiceUnavailable } from '@/lib/serviceAvailability';
import { getClientApiBaseUrl } from './baseUrl';

const REFRESH_PATH = 'api/v1/users/refresh';
const PRE_AUTH_PATHS = ['api/v1/users/login', 'api/v1/users/signup', 'api/v1/auth/oauth', 'api/v1/auth/social/signup'];
const isPreAuth = (url: string) => PRE_AUTH_PATHS.some((path) => new URL(url).pathname === `/${path}`);
const isRefresh = (url: string) => new URL(url).pathname === `/${REFRESH_PATH}`;

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = getLoginHref(window.location.pathname + window.location.search);
  }
};

let refreshPromise: Promise<Response> | null = null;

const triggerRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${getClientApiBaseUrl()}/${REFRESH_PATH}`, {
      method: 'POST',
      credentials: 'include',
      signal: AbortSignal.timeout(10000),
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const createClient = () =>
  ky.create({
    prefixUrl: getClientApiBaseUrl(),
    timeout: 10000,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    retry: {
      limit: 1,
      methods: ['get', 'post', 'put', 'patch', 'delete', 'head'],
      statusCodes: [401],
    },
    hooks: {
      beforeRetry: [
        async ({ request, error }) => {
          if (
            !(error instanceof HTTPError) ||
            error.response.status !== 401 ||
            isPreAuth(request.url) ||
            isRefresh(request.url)
          ) {
            throw error;
          }
          let refreshRes: Response;
          try {
            refreshRes = await triggerRefresh();
          } catch (refreshError) {
            notifyServiceUnavailable();
            throw refreshError;
          }
          if (!refreshRes.ok) {
            if (refreshRes.status >= 500) {
              notifyServiceUnavailable();
            } else if (refreshRes.status === 401 || refreshRes.status === 403) {
              redirectToLogin();
            }
            throw error;
          }
        },
      ],
      afterResponse: [
        (request, _options, response, { retryCount }) => {
          if (isServiceUnavailableStatus(response.status)) {
            notifyServiceUnavailable();
          }
          if (response.status === 401 && retryCount > 0 && !isPreAuth(request.url) && !isRefresh(request.url)) {
            redirectToLogin();
          }
        },
      ],
      beforeError: [
        async (error) => {
          const body = await error.response
            .clone()
            .json()
            .catch(() => null);
          Object.assign(error, { status: error.response.status, body });
          return error;
        },
      ],
    },
  });

export const client = new Proxy((() => createClient()) as unknown as KyInstance, {
  apply(_target, _thisArg, argArray) {
    return Reflect.apply(createClient(), undefined, argArray);
  },
  get(_target, property) {
    return Reflect.get(createClient(), property);
  },
});
