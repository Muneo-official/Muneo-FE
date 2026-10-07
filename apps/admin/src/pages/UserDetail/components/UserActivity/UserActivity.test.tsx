import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getUserActivity } from '@/api/activity/api';
import { ApiError } from '@/api/request';
import { UserActivity } from './UserActivity';
import { paginate, qaEstimates, qaFeedback } from '../../../../../qa/fixtures';

vi.mock('@/api/activity/api', () => ({ getUserActivity: vi.fn() }));
const mockGet = vi.mocked(getUserActivity);
const renderActivity = (userId = 101) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const renderWith = (id: number) => (
    <QueryClientProvider client={client}>
      <UserActivity userId={id} key={id} />
    </QueryClientProvider>
  );
  return { ...render(renderWith(userId)), renderWith };
};
afterEach(() => vi.resetAllMocks());

describe('사용자 이용 내역 화면', () => {
  it('API 미연결을 빈 기록과 구분하고 재시도로 복구한다', async () => {
    mockGet.mockRejectedValueOnce(new ApiError('미지원', 404, 'NOT_FOUND')).mockResolvedValue(paginate([], 0, 10));
    renderActivity();
    expect(await screen.findByRole('alert')).toHaveTextContent('조회 API가 아직 제공되지 않거나');
    expect(screen.queryByText('저장된 예상 견적 기록이 없습니다.')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByText('저장된 예상 견적 기록이 없습니다.')).toBeInTheDocument();
  });

  it('다른 사용자로 이동하면 이전 기록과 펼친 상세를 즉시 제거한다', async () => {
    mockGet.mockResolvedValueOnce(paginate(qaEstimates, 0, 10)).mockImplementation(() => new Promise(() => {}));
    const view = renderActivity();
    await screen.findByText('예상 견적 총 21건');
    expect(screen.getByText('ID: qa-estimate-21')).toBeInTheDocument();
    view.rerender(view.renderWith(102));
    expect(screen.queryByText('ID: qa-estimate-21')).not.toBeInTheDocument();
    expect(await screen.findByText('이용 내역을 불러오는 중입니다.')).toBeInTheDocument();
  });

  it('페이지를 넘긴 후 피드백으로 전환하면 첫 페이지에서 평가를 조회한다', async () => {
    mockGet.mockImplementation(async (_id, kind, page) =>
      kind === 'feedback'
        ? (paginate(qaFeedback, page, 10) as Awaited<ReturnType<typeof getUserActivity>>)
        : paginate(qaEstimates, page, 10)
    );
    renderActivity();
    await screen.findByText('예상 견적 총 21건');
    await userEvent.click(screen.getByRole('button', { name: '다음' }));
    await screen.findByText('2 / 3 페이지');
    await userEvent.click(screen.getByRole('button', { name: '진단 피드백' }));
    await waitFor(() => expect(mockGet).toHaveBeenLastCalledWith(101, 'feedback', 0, expect.any(AbortSignal)));
    expect(await screen.findByText('진단 ID: qa-report-1')).toBeInTheDocument();
    expect(screen.getByText('놓친 항목을 찾았어요')).toBeInTheDocument();
    expect(screen.queryByText('ID: qa-estimate-21')).not.toBeInTheDocument();
  });
});
