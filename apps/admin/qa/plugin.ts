import { type IncomingMessage, type ServerResponse } from 'node:http';
import { type Plugin } from 'vite';
import { paginate, qaAdmin, qaEstimates, qaFeedback, qaReports, qaUsers } from './fixtures';

const COOKIE = 'muneo_admin_qa_session=local-only';
const send = (res: ServerResponse, status: number, result: unknown = null) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(
    JSON.stringify({
      success: status < 400,
      status,
      code: status < 400 ? 'SUCCESS' : 'QA_ERROR',
      timestamp: new Date().toISOString(),
      message: status < 400 ? 'QA 가상 응답' : 'QA 오류 응답',
      result,
    })
  );
};

const handle = async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (url.pathname === '/api/v1/admin/login' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) {
      body += String(chunk);
      if (body.length > 4096) {
        return send(res, 413);
      }
    }
    const data = JSON.parse(body) as { email?: string; password?: string };
    if (data.email !== 'admin@example.test' || data.password !== 'MuneoQa123!') {
      return send(res, 401);
    }
    res.setHeader('Set-Cookie', `${COOKIE}; HttpOnly; SameSite=Lax; Path=/api`);
    return send(res, 200, qaAdmin);
  }
  if (!req.headers.cookie?.split(';').some((cookie) => cookie.trim() === COOKIE)) {
    return send(res, 401);
  }
  if (url.pathname === '/api/v1/users/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', 'muneo_admin_qa_session=; Max-Age=0; HttpOnly; SameSite=Lax; Path=/api');
    return send(res, 200);
  }
  if (req.method !== 'GET') {
    return send(res, 405);
  }
  if (url.pathname === '/api/v1/users/me') {
    return send(res, 200, qaAdmin);
  }

  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? 10);
  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 100) {
    return send(res, 400);
  }
  if (url.pathname === '/api/v1/admin/users') {
    const keyword = url.searchParams.get('keyword')?.toLowerCase() ?? '';
    const users = qaUsers.filter((user) => {
      if (!`${user.name} ${user.email}`.toLowerCase().includes(keyword)) {
        return false;
      }
      return ['role', 'deleted', 'authProvider', 'emailVerified', 'profileCompleted'].every((key) => {
        const filter = url.searchParams.get(key);
        return filter === null || String(user[key as keyof typeof user]) === filter;
      });
    });
    return send(res, 200, paginate(users, page, size));
  }
  const match = url.pathname.match(/^\/api\/v1\/admin\/users\/(\d+)(?:\/(estimates|risk-reports|feedback))?$/);
  if (!match) {
    return send(res, 404);
  }
  const user = qaUsers.find((item) => item.id === Number(match[1]));
  if (!user) {
    return send(res, 404);
  }
  const kind = match[2];
  if (!kind) {
    return send(res, 200, user);
  }
  if (user.id === 103) {
    return send(res, 404);
  }
  if (user.id === 104) {
    return send(res, 503);
  }
  if (user.id === 106) {
    return send(res, 403);
  }
  const records = kind === 'estimates' ? qaEstimates : kind === 'risk-reports' ? qaReports : qaFeedback;
  // 105는 다른 소유자의 응답이 UI에서 차단되는지 확인하는 의도적인 오류 사례다.
  return send(res, 200, paginate<unknown>(user.id === 102 ? [] : records, page, size));
};

export const adminQaPlugin = (): Plugin => ({
  name: 'muneo-local-admin-qa',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api/')) {
        return next();
      }
      void handle(req, res).catch(() => {
        if (!res.writableEnded) {
          send(res, 400);
        }
      });
    });
  },
});
