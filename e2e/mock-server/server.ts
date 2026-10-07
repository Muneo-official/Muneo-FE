import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { RiskReport } from '../../apps/web/src/api/analyze/types';
import type {
  EstimateGenerateRequest,
  EstimateGenerateResponse,
  EstimateSaveResponse,
} from '../../apps/web/src/api/estimate/types';
import type { EstimateItem, RiskItem } from '../../apps/web/src/api/history/types';
import type { ApiErrorResponse, ApiSuccessResponse } from '../../apps/web/src/api/types';
import type { AuthUser } from '../../apps/web/src/types/auth';

const PORT = Number(process.env.MOCK_PORT ?? 4000);

// e2e mock은 Next dev origin에서만 호출됨 — wildcard 금지, 고정 allowlist
const CORS_ALLOWED_ORIGINS = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);

// ─────────────────────────────────────────────────────────────
// Mock fixtures (서버에서 받는 진짜 응답 shape과 일치)
// ─────────────────────────────────────────────────────────────

const MOCK_USER: AuthUser = {
  id: 1,
  email: 'tester@muneo.test',
  name: '문어테스터',
  phoneNumber: '01012345678',
  birthDate: '1995-05-15',
  authProvider: 'LOCAL',
  profileCompleted: true,
  role: 'USER',
};

const MOCK_ESTIMATE_INPUT: EstimateGenerateRequest = {
  공종: ['도배', '마루'],
  시공범위: '전체',
  공간유형: '아파트',
  평수: 25,
  방개수: 3,
  지역: '서울',
  건물연식: '10~20년',
  자재등급: '중급',
  철거여부: '있음',
  층수: 5,
  엘리베이터: '있음',
  트럭접근: '있음',
  거주중공사: '아니오',
  공사시기: '봄',
};

const MOCK_ESTIMATE_RESULT: EstimateGenerateResponse = {
  총_견적_범위: { 최소: 30_000_000, 중간: 38_000_000, 최대: 45_000_000 },
  공종별_단가_범위: {},
  공종별_항목_명세: {},
  보정_적용: [],
  시공범위: '전체',
  선택_공종: ['도배', '마루'],
  참고_사례_수: 10,
  참고_사례: [],
  검색_쿼리: '',
};

const MOCK_ESTIMATES: EstimateItem[] = [
  {
    id: 'est-1',
    user_id: '1',
    created_at: '2026-05-20T10:00:00Z',
    input: MOCK_ESTIMATE_INPUT,
    result: MOCK_ESTIMATE_RESULT,
  },
];

const MOCK_REPORT: RiskReport = {
  title: 'A업체 견적서 진단',
  subtitle_fields: { pyeong: 25, company_name: 'A업체', analyzed_date: '2026-05-18' },
  construction_info: {
    space_type: '아파트',
    region: '서울',
    building_age: '10~20년',
    floor: 5,
    elevator: true,
    room_count: 3,
  },
  cards: {},
  process_sections: [],
  summary: { total_risk_items: 4, chips: { 누락: 2, 중복: 1, 불분명: 1 } },
};

const MOCK_RISKS: RiskItem[] = [
  {
    id: 'risk-1',
    user_id: '1',
    created_at: '2026-05-18T14:00:00Z',
    input: {
      space_type: '아파트',
      pyeong: 25,
      room_count: 2,
      floor: 3,
      elevator: true,
      region: '서울',
      building_age: '10~20년',
      company_name: 'A업체',
    },
    result: { report: MOCK_REPORT },
  },
];

const MOCK_SAVE_ID: EstimateSaveResponse = { id: 'est-new' };

// ─────────────────────────────────────────────────────────────
// Response envelope helpers
// ─────────────────────────────────────────────────────────────

const SET_COOKIE_LOGIN = [
  'access_token=mock-access; Path=/; HttpOnly; SameSite=Lax',
  'refresh_token=mock-refresh; Path=/; HttpOnly; SameSite=Lax',
];
const SET_COOKIE_CLEAR = [
  'access_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  'refresh_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
];

const success = <T>(result: T, status = 200): { status: number; body: ApiSuccessResponse<T> } => ({
  status,
  body: {
    success: true,
    status,
    code: 'OK',
    timestamp: new Date().toISOString(),
    message: '',
    result,
  },
});

const fail = (code: string, message: string, status: number): { status: number; body: ApiErrorResponse } => ({
  status,
  body: {
    success: false,
    status,
    code,
    timestamp: new Date().toISOString(),
    message,
  },
});

type RawReply = { status: number; body: unknown };

const parseJson = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const hasAccessCookie = (req: IncomingMessage): boolean => {
  const cookie = req.headers.cookie ?? '';
  return /(?:^|;\s*)access_token=mock-access/.test(cookie);
};

const send = (
  res: ServerResponse,
  reply: { status: number; body: unknown },
  extra: Record<string, string | string[]> = {}
) => {
  res.writeHead(reply.status, { 'Content-Type': 'application/json', ...extra });
  res.end(JSON.stringify(reply.body));
};

const sendRaw = (res: ServerResponse, status: number, body: unknown, extra: Record<string, string | string[]> = {}) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...extra });
  res.end(JSON.stringify(body));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────
// Test scenario triggers
//   - 이메일 패턴 기반: error@/slow@/taken@/no-history@
//   - 헤더 기반: x-test-scenario: server-error
// ─────────────────────────────────────────────────────────────

const SERVER_ERROR_REPLY = (path: string) => fail('INTERNAL_SERVER_ERROR', `테스트용 서버 에러 (${path})`, 500);

const scenarioFromHeader = (req: IncomingMessage): string | undefined => {
  const v = req.headers['x-test-scenario'];
  return Array.isArray(v) ? v[0] : v;
};

const shouldTriggerScenario = (req: IncomingMessage, scenario: string) => scenarioFromHeader(req) === scenario;

// ─────────────────────────────────────────────────────────────
// Server
// ─────────────────────────────────────────────────────────────

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const key = `${req.method} ${url.pathname}`;

  // CORS preflight — 로컬 e2e 전용 mock이므로 Next dev origin만 허용
  // (요청 origin을 그대로 echo하면 CodeQL이 cors-misconfig로 잡음 — allowlist 고정)
  if (req.method === 'OPTIONS') {
    const requestOrigin = req.headers.origin;
    if (typeof requestOrigin === 'string' && CORS_ALLOWED_ORIGINS.has(requestOrigin)) {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': requestOrigin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Cookie, x-user-id, x-test-scenario',
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
      });
    } else {
      res.writeHead(403);
    }
    res.end();
    return;
  }

  // 글로벌 시나리오: 모든 요청에 5xx 강제
  if (shouldTriggerScenario(req, 'server-error')) {
    send(res, SERVER_ERROR_REPLY(url.pathname));
    return;
  }

  // POST /api/v1/users/login
  if (key === 'POST /api/v1/users/login') {
    const body = await parseJson(req);
    const email = String(body.email ?? '');
    const password = String(body.password ?? '');
    console.log('[mock] login attempt:', { email, password });
    if (email === 'error@muneo.test') {
      send(res, SERVER_ERROR_REPLY(url.pathname));
      return;
    }
    if (email === 'slow@muneo.test') {
      await delay(3000);
      send(res, success(MOCK_USER), { 'Set-Cookie': SET_COOKIE_LOGIN });
      return;
    }
    // tester@muneo.test 계정은 비밀번호 무관하게 통과 (테스트 편의)
    if (email === 'tester@muneo.test') {
      send(res, success(MOCK_USER), { 'Set-Cookie': SET_COOKIE_LOGIN });
      return;
    }
    if (email && password === 'Correct123') {
      send(res, success(MOCK_USER), { 'Set-Cookie': SET_COOKIE_LOGIN });
      return;
    }
    send(res, fail('INVALID_LOGIN_INFO', '이메일 또는 비밀번호가 올바르지 않습니다.', 401));
    return;
  }

  // POST /api/v1/users/signup
  if (key === 'POST /api/v1/users/signup') {
    const body = await parseJson(req);
    if (body.email === 'taken@muneo.test') {
      send(res, fail('EMAIL_ALREADY_EXISTS', '이미 가입된 이메일입니다.', 409));
      return;
    }
    if (body.email === 'error@muneo.test') {
      send(res, SERVER_ERROR_REPLY(url.pathname));
      return;
    }
    send(res, success(MOCK_USER), { 'Set-Cookie': SET_COOKIE_LOGIN });
    return;
  }

  // POST /api/v1/users/logout
  if (key === 'POST /api/v1/users/logout') {
    send(res, success(null), { 'Set-Cookie': SET_COOKIE_CLEAR });
    return;
  }

  // POST /api/v1/users/refresh
  if (key === 'POST /api/v1/users/refresh') {
    const cookie = req.headers.cookie ?? '';
    if (/refresh_token=mock-refresh/.test(cookie)) {
      send(res, success(null), { 'Set-Cookie': SET_COOKIE_LOGIN });
    } else {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
    }
    return;
  }

  // POST /api/v1/users/withdraw
  if (key === 'POST /api/v1/users/withdraw') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    send(res, success(null), { 'Set-Cookie': SET_COOKIE_CLEAR });
    return;
  }

  // PATCH /api/v1/users/me
  if (key === 'PATCH /api/v1/users/me') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    await parseJson(req);
    send(res, success(MOCK_USER));
    return;
  }

  // POST /api/v1/estimates/generate (raw)
  if (key === 'POST /api/v1/estimates/generate') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    sendRaw(res, 200, MOCK_ESTIMATE_RESULT);
    return;
  }

  // POST /api/v1/estimates/save (raw)
  if (key === 'POST /api/v1/estimates/save') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    sendRaw(res, 200, MOCK_SAVE_ID);
    return;
  }

  // POST /api/v1/risk-detector/analyze (raw)
  if (key === 'POST /api/v1/risk-detector/analyze') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    sendRaw(res, 200, { report: MOCK_REPORT });
    return;
  }

  // POST /api/v1/risk-detector/save (raw)
  if (key === 'POST /api/v1/risk-detector/save') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    sendRaw(res, 200, { id: 'risk-new' });
    return;
  }

  // Health check (no auth)
  if (key === 'GET /') {
    sendRaw(res, 200, { ok: true });
    return;
  }

  // Authed GET routes
  if (req.method === 'GET') {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    if (key === 'GET /api/v1/users/me') {
      send(res, success(MOCK_USER));
      return;
    }
    if (key === 'GET /api/v1/estimates') {
      sendRaw(res, 200, MOCK_ESTIMATES);
      return;
    }
    if (key === 'GET /api/v1/risk-detector') {
      sendRaw(res, 200, MOCK_RISKS);
      return;
    }
  }

  // Unknown route — explicit 404 envelope (drift detection)
  send(res, fail('NOT_FOUND', `Mock route not implemented: ${key}`, 404));
});

const reply: RawReply = { status: 200, body: { ok: true } };
void reply; // type-check helper

server.on('error', (err) => {
  console.error('[mock-server] failed to start:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`[mock-server] listening on http://localhost:${PORT}`);
});
