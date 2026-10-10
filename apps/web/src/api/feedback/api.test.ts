import { afterEach, describe, expect, it, vi } from 'vitest';
import { deleteDiagnosisFeedback, getDiagnosisFeedback, saveDiagnosisFeedback } from './api';
import { type DiagnosisFeedbackRequest } from './types';

const json = (result: unknown, status = 200) =>
  new Response(JSON.stringify(result), { status, headers: { 'Content-Type': 'application/json' } });
const draft: DiagnosisFeedbackRequest = {
  schema_version: 1,
  rating: 'bad',
  reasons: ['incorrect_result'],
  comment: '  확인해 주세요  ',
};
const saved = {
  ...draft,
  comment: draft.comment.trim(),
  report_version: 'risk-1',
  updated_at: '2026-10-10T09:00:00',
  item_reviews: [],
};
afterEach(() => vi.unstubAllGlobals());

describe('확정 피드백 API 계약', () => {
  it('쿠키 인증으로 모든 필드를 보내며 빈 204 본문을 파싱하지 않는다', async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.method).toBe('PUT');
      expect(request.url).toMatch(/\/api\/v1\/risk-detector\/risk-1\/feedback$/);
      expect(request.credentials).toBe('include');
      expect(request.headers.has('x-user-id')).toBe(false);
      expect(await request.json()).toEqual({ ...draft, comment: '확인해 주세요', item_reviews: [] });
      return new Response(null, { status: 204 });
    });
    vi.stubGlobal('fetch', fetchMock);
    await expect(saveDiagnosisFeedback('risk-1', draft)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('전체 교체 시 사유와 의견을 비운 요청도 빠짐없이 보낸다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        expect(await request.json()).toEqual({
          schema_version: 1,
          rating: 'good',
          reasons: [],
          comment: '',
          item_reviews: [],
        });
        return new Response(null, { status: 204 });
      })
    );
    await saveDiagnosisFeedback('risk-1', { schema_version: 1, rating: 'good', reasons: [], comment: '' });
  });

  it('조회 200 봉투는 복원하고 204는 의견 없음으로 처리한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(json({ success: true, result: saved }))
        .mockResolvedValueOnce(new Response(null, { status: 204 }))
    );
    expect(await getDiagnosisFeedback('risk-1')).toMatchObject({
      ...draft,
      comment: '확인해 주세요',
      report_version: 'risk-1',
    });
    expect(await getDiagnosisFeedback('risk-1')).toBeNull();
  });

  it.each([
    { success: true, result: { ...saved, report_version: 'other-report' } },
    { success: true, result: { ...saved, rating: 'unknown' } },
    { success: true, result: { ...saved, reasons: ['found_risks'] } },
    { success: true, result: null },
  ])('다른 진단이나 잘못된 응답을 빈 의견으로 간주하지 않는다: %j', async (body) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json(body))
    );
    await expect(getDiagnosisFeedback('risk-1')).rejects.toMatchObject({ code: 'INVALID_FEEDBACK_RESPONSE' });
  });

  it('삭제 요청은 피드백 경로에만 전송하고 204를 처리한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        expect(request.method).toBe('DELETE');
        expect(request.url).toMatch(/\/risk-1\/feedback$/);
        expect(request.credentials).toBe('include');
        return new Response(null, { status: 204 });
      })
    );
    await expect(deleteDiagnosisFeedback('risk-1')).resolves.toBeUndefined();
  });

  it.each([
    [400, 'VALIDATION_FAILED'],
    [403, 'RISK_REPORT_ACCESS_FORBIDDEN'],
    [404, 'RISK_REPORT_NOT_FOUND'],
    [409, 'RISK_FEEDBACK_CONFLICT'],
    [422, 'UNPROCESSABLE_ENTITY'],
    [503, 'RISK_REPORT_STORE_UNAVAILABLE'],
  ])('%s 오류를 자동 재전송하지 않고 코드와 상태를 보존한다', async (status, code) => {
    const fetchMock = vi.fn(async () => json({ success: false, code, message: '실패' }, status));
    vi.stubGlobal('fetch', fetchMock);
    await expect(saveDiagnosisFeedback('risk-1', draft)).rejects.toMatchObject({ code, status });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    { ...draft, reasons: ['found_risks'] },
    { ...draft, reasons: ['incorrect_result', 'incorrect_result'] },
    { ...draft, comment: '가'.repeat(501) },
  ])('잘못된 입력은 서버에 보내지 않는다: %j', async (input) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(saveDiagnosisFeedback('risk-1', input as DiagnosisFeedbackRequest)).rejects.toMatchObject({
      code: 'VALIDATION_FAILED',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
