import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { FEEDBACK_REASONS, type DiagnosisFeedback } from '../../apps/web/src/api/feedback/types';
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
const feedbackByReport = new Map<string, DiagnosisFeedback>();

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

const trialResults = new Map<string, { preview: unknown; full: unknown }>();

// Muneo-Server TrialStore.project()와 같은 규칙: 대표 공정 하나만 전체 공개, 나머지는 이름·건수만.
const RISK_WEIGHT: Record<string, number> = { 누락: 3, 불분명: 2, 중복: 1 };
const riskCounts = (items: { status: string }[]) => ({
  누락: items.filter((i) => i.status === '누락').length,
  중복: items.filter((i) => i.status === '중복').length,
  불분명: items.filter((i) => i.status === '불분명').length,
});

const projectAnalysisPreview = (report: RiskReport, expiresAt: string) => {
  const sections = report.process_sections.map((section, index) => ({
    section,
    index,
    id: section.id ?? String(index),
  }));
  const score = (items: { status: string }[]) => items.reduce((sum, i) => sum + (RISK_WEIGHT[i.status] ?? 0), 0);
  const revealed = sections
    .filter(({ section }) => section.items.length > 0)
    .reduce<(typeof sections)[number] | null>((best, cur) => {
      if (!best) return cur;
      const diff = score(cur.section.items) - score(best.section.items);
      return diff > 0 || (diff === 0 && cur.section.items.length > best.section.items.length) ? cur : best;
    }, null);
  const all = report.process_sections.flatMap((s) => s.items);
  return {
    kind: 'analysis',
    expiresAt,
    report: {
      subtitle_fields: report.subtitle_fields,
      construction_info: report.construction_info,
      process_sections: revealed ? [{ ...revealed.section, id: revealed.id }] : [],
    },
    sections: sections.map(({ section, id }) => ({
      id,
      display_name: section.display_name,
      itemCount: section.items.length,
      counts: riskCounts(section.items),
      locked: id !== revealed?.id,
    })),
    counts: riskCounts(all),
    totalItems: all.length,
  };
};

const projectEstimatePreview = (
  input: EstimateGenerateRequest,
  result: EstimateGenerateResponse,
  expiresAt: string
) => {
  const insufficient = result.데이터_부족_공종 ?? [];
  const evidence = (name: string) => (result.공종별_항목_명세[name] ?? []).filter((i) => i.등장_사례_수 > 0).length;
  const revealed =
    result.선택_공종
      .filter((name) => result.공종별_단가_범위[name] && !insufficient.includes(name))
      .reduce<string | null>((best, name) => (best === null || evidence(name) > evidence(best) ? name : best), null) ??
    null;
  const open = (name: string) => name === revealed || insufficient.includes(name);
  const pickOpen = <T>(record: Record<string, T>) =>
    Object.fromEntries(Object.entries(record).filter(([name]) => open(name)));
  return {
    kind: 'estimate',
    expiresAt,
    input,
    result: {
      선택_공종: result.선택_공종,
      시공범위: result.시공범위,
      보정_적용: result.보정_적용,
      참고_사례_수: result.참고_사례_수,
      데이터_부족_공종: insufficient,
      공종별_단가_범위: pickOpen(result.공종별_단가_범위),
      공종별_항목_명세: pickOpen(result.공종별_항목_명세),
    },
    revealedProcess: revealed,
    lockedProcesses: result.선택_공종
      .filter((name) => !open(name))
      .map((name) => ({
        name,
        itemCount: (result.공종별_항목_명세[name] ?? []).length,
        priced: Boolean(result.공종별_단가_범위[name]),
      })),
  };
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const key = `${req.method} ${url.pathname}`;

  // 비회원 체험 계약 검증용. 실제 서비스에서는 Redis와 AI 분석을 사용한다.
  const trialMatch = url.pathname.match(/^\/api\/v1\/trials\/(analysis|estimate)(\/result)?$/);
  if (trialMatch) {
    const kind = trialMatch[1];
    const token = req.headers.cookie?.match(/(?:^|;\s*)muneo_trial=([^;]+)/)?.[1] ?? crypto.randomUUID();
    const trialKey = kind + ':' + token;
    const headers = {
      'Set-Cookie': 'muneo_trial=' + token + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800',
      'Cache-Control': 'no-store',
    };
    const stored = trialResults.get(trialKey);
    if (trialMatch[2]) {
      if (!hasAccessCookie(req)) {
        sendRaw(res, 401, { message: '로그인이 필요합니다.' });
        return;
      }
      if (!stored) {
        sendRaw(res, 410, { message: '보관 시간이 지났어요.' });
        return;
      }
      sendRaw(res, 200, stored.full, headers);
      return;
    }
    if (req.method === 'GET') {
      sendRaw(res, stored ? 200 : 204, stored?.preview ?? null, headers);
      return;
    }
    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const raw = Buffer.concat(chunks).toString('utf8');
      const expiresAt = new Date(Date.now() + 1800000).toISOString();
      const report: RiskReport = {
        ...MOCK_REPORT,
        process_sections: [
          {
            process: '도배',
            display_name: '도배 공사',
            items: [
              {
                title: '비공개 전체 항목: 도배 인건비',
                status: '중복',
                description: '도배 인건비가 중복되어 있어요.',
                guide: '인건비 범위를 구분해 주세요.',
              },
            ],
          },
          {
            process: '철거',
            display_name: '철거 공사',
            items: [
              {
                title: '폐기물 처리 비용 확인',
                status: '누락',
                description: '철거 항목에 폐기물 처리비가 없어요.',
                guide: '운반과 처리 비용이 포함되어 있나요?',
              },
            ],
          },
        ],
        summary: { total_risk_items: 2, chips: { 누락: 1, 중복: 1, 불분명: 0 } },
      };
      const estimateInput: EstimateGenerateRequest = kind === 'estimate' ? JSON.parse(raw) : MOCK_ESTIMATE_INPUT;
      const result: EstimateGenerateResponse = {
        ...MOCK_ESTIMATE_RESULT,
        선택_공종: estimateInput.공종,
        공종별_단가_범위: Object.fromEntries(
          estimateInput.공종.map((name, index) => [
            name,
            index === 0
              ? { 최소: 1000000, 중간: 1500000, 최대: 2000000 }
              : { 최소: 3100000, 중간: 3500000, 최대: 3900000 },
          ])
        ),
        공종별_항목_명세: Object.fromEntries(
          estimateInput.공종.map((name, index) => [
            name,
            index === 0
              ? [
                  {
                    description: '실크 벽지 시공',
                    amount_range: { 최소: 600000, 중간: 800000, 최대: 1000000 },
                    등장_사례_수: 7,
                  },
                  {
                    description: '초배지',
                    amount_range: { 최소: 400000, 중간: 500000, 최대: 600000 },
                    등장_사례_수: 3,
                  },
                ]
              : [
                  {
                    description: `비공개 전체 항목: ${name} 세부`,
                    amount_range: { 최소: 3100000, 중간: 3500000, 최대: 3900000 },
                    등장_사례_수: 0,
                  },
                ],
          ])
        ),
      };
      const preview =
        kind === 'analysis'
          ? projectAnalysisPreview(report, expiresAt)
          : projectEstimatePreview(estimateInput, result, expiresAt);
      const full =
        kind === 'analysis' ? { input: MOCK_RISKS[0].input, result: { report } } : { input: estimateInput, result };
      trialResults.set(trialKey, { preview, full });
      await delay(250);
      sendRaw(res, 200, preview, headers);
      return;
    }
  }

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

  const feedbackMatch = url.pathname.match(/^\/api\/v1\/risk-detector\/([^/]+)\/feedback$/);
  if (feedbackMatch) {
    if (!hasAccessCookie(req)) {
      send(res, fail('UNAUTHORIZED', '인증이 필요합니다.', 401));
      return;
    }
    const reportId = feedbackMatch[1];
    if (!MOCK_RISKS.some((item) => item.id === reportId) && reportId !== 'risk-new') {
      send(res, fail('RISK_REPORT_NOT_FOUND', '진단을 찾을 수 없습니다.', 404));
      return;
    }
    if (req.method === 'GET') {
      const feedback = feedbackByReport.get(reportId);
      if (feedback) send(res, success({ ...feedback, item_reviews: [] }));
      else {
        res.writeHead(204);
        res.end();
      }
      return;
    }
    if (req.method === 'DELETE') {
      feedbackByReport.delete(reportId);
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === 'PUT') {
      const data = await parseJson(req);
      const { rating, reasons, comment } = data;
      if (
        data.schema_version !== 1 ||
        (rating !== 'good' && rating !== 'bad') ||
        !Array.isArray(reasons) ||
        reasons.length > 3 ||
        new Set(reasons).size !== reasons.length ||
        !reasons.every((reason) => FEEDBACK_REASONS[rating].some((option) => option.value === reason)) ||
        typeof comment !== 'string' ||
        comment.trim().length > 500 ||
        !Array.isArray(data.item_reviews) ||
        data.item_reviews.length !== 0 ||
        'user_id' in data
      ) {
        send(res, fail('VALIDATION_FAILED', '요청 값을 확인해 주세요.', 400));
        return;
      }
      feedbackByReport.set(reportId, {
        schema_version: 1,
        rating,
        reasons: reasons as DiagnosisFeedback['reasons'],
        comment: comment.trim(),
        report_version: reportId,
        updated_at: new Date().toISOString(),
      });
      res.writeHead(204);
      res.end();
      return;
    }
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
