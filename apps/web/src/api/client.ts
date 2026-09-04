import ky, { type KyInstance } from 'ky';
import { getClientApiBaseUrl } from './baseUrl';

const REFRESH_PATH = 'api/v1/users/refresh';
const PRE_AUTH_PATHS = ['api/v1/users/login', 'api/v1/users/signup', 'api/v1/auth/oauth', 'api/v1/auth/social/signup'];
const SKIP_AUTO_REDIRECT_PATHS = ['api/v1/chatbot/chat'];

const isPreAuth = (url: string) => PRE_AUTH_PATHS.some((p) => url.includes(p));
const isRefresh = (url: string) => url.includes(REFRESH_PATH);
const skipsAutoRedirect = (url: string) => {
  try {
    const normalized = new URL(url).pathname.replace(/^\//, '');
    return SKIP_AUTO_REDIRECT_PATHS.includes(normalized);
  } catch {
    return false;
  }
};

let refreshPromise: Promise<Response> | null = null;

const triggerRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${getClientApiBaseUrl()}/${REFRESH_PATH}`, {
      method: 'POST',
      credentials: 'include',
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
          const status = (error as { status?: number }).status;
          if (status !== 401) {
            throw error;
          }
          if (isPreAuth(request.url) || isRefresh(request.url)) {
            throw error;
          }
          const refreshRes = await triggerRefresh();
          if (!refreshRes.ok) {
            if (!skipsAutoRedirect(request.url) && typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            throw error;
          }
        },
      ],
      afterResponse: [
        async (_request, _options, response) => {
          if (!response.ok) {
            const body = await response
              .clone()
              .json()
              .catch(() => null);
            const error = new Error(`API Error: ${response.status}`);
            Object.assign(error, { status: response.status, body });
            throw error;
          }
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
