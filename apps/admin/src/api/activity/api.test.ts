import { afterEach, describe, expect, it, vi } from 'vitest';
import { paginate, qaEstimates, qaFeedback } from '../../../qa/fixtures';
import { client } from '../client';
import { ApiError } from '../request';
import { getUserActivity, parseActivityPage } from './api';

afterEach(() => vi.restoreAllMocks());

describe('관리자 사용자별 이용 내역', () => {
  it('선택 사용자 ID를 관리자 경로로 전달하고 취소 신호를 유지한다', async () => {
    const page = paginate(qaEstimates, 1, 10);
    const get = vi.spyOn(client, 'get').mockResolvedValue({ data: { success: true, result: page } });
    const signal = new AbortController().signal;
    expect(await getUserActivity(101, 'estimates', 1, signal)).toEqual(page);
    expect(get).toHaveBeenCalledWith('/api/v1/admin/users/101/estimates', { params: { page: 1, size: 10 }, signal });
  });

  it('정상적인 빈 페이지는 0건으로 인정한다', () => {
    expect(parseActivityPage(paginate([], 0, 10), 102, 'estimates', 0).totalElements).toBe(0);
  });

  it.each([null, {}, { content: [] }])('잘못된 응답을 빈 기록으로 취급하지 않는다: %j', (payload) => {
    expect(() => parseActivityPage(payload, 101, 'estimates', 0)).toThrow(ApiError);
  });

  it('다른 사용자 소유의 기록은 표시 전에 차단한다', () => {
    expect(() => parseActivityPage(paginate(qaEstimates, 0, 10), 102, 'estimates', 0)).toThrow(
      '소유자가 일치하지 않습니다'
    );
  });

  it('총 21건의 마지막 페이지에는 1건만 반환한다', () => {
    const result = parseActivityPage(paginate(qaEstimates, 2, 10), 101, 'estimates', 2);
    expect(result.content).toHaveLength(1);
    expect(result.last).toBe(true);
  });

  it('서버가 요청한 페이지 대신 첫 페이지를 반환하면 오류로 처리한다', () => {
    expect(() => parseActivityPage(paginate(qaEstimates, 0, 10), 101, 'estimates', 1)).toThrow('페이지 정보');
  });

  it('전체 건수가 있는데 기록이 누락된 응답은 거절한다', () => {
    expect(() => parseActivityPage({ ...paginate(qaEstimates, 0, 10), content: [] }, 101, 'estimates', 0)).toThrow(
      '페이지 정보'
    );
  });

  it('피드백은 진단 ID와 전체 평가·이유·의견을 보존한다', () => {
    const result = parseActivityPage(paginate(qaFeedback, 0, 10), 101, 'feedback', 0);
    expect(result.content[0]).toMatchObject({
      report_id: 'qa-report-1',
      rating: 'good',
      reasons: ['found_risks', 'useful_questions'],
    });
  });

  it('피드백에 날짜가 누락되면 생성일을 임의로 채우지 않는다', () => {
    const invalid = [{ ...qaFeedback[0], created_at: undefined }];
    expect(() => parseActivityPage(paginate(invalid, 0, 10), 101, 'feedback', 0)).toThrow('응답 형식');
  });

  it.each([0, -1, 1.5, NaN])('잘못된 사용자 ID로 요청하지 않는다: %s', async (id) => {
    const get = vi.spyOn(client, 'get');
    await expect(getUserActivity(id, 'estimates', 0)).rejects.toMatchObject({ status: 400 });
    expect(get).not.toHaveBeenCalled();
  });
});
