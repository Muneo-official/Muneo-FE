import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/errors';
import * as feedbackApi from '@/api/feedback';
import { DiagnosisFeedback, getFeedbackMode } from './DiagnosisFeedback';

vi.mock('@/api/feedback', async (importOriginal) => ({
  ...(await importOriginal<typeof feedbackApi>()),
  getDiagnosisFeedback: vi.fn(),
  saveDiagnosisFeedback: vi.fn(),
  deleteDiagnosisFeedback: vi.fn(),
}));
const stored: feedbackApi.DiagnosisFeedback = {
  schema_version: 1,
  rating: 'bad',
  reasons: ['incorrect_result'],
  comment: '기존 의견',
  report_version: 'risk-1',
  updated_at: '2026-10-10T09:00:00',
};
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(feedbackApi.getDiagnosisFeedback).mockResolvedValue(null);
  vi.mocked(feedbackApi.saveDiagnosisFeedback).mockResolvedValue();
  vi.mocked(feedbackApi.deleteDiagnosisFeedback).mockResolvedValue();
});
const ready = () => screen.findByRole('button', { name: '도움이 됐어요' });

describe('진단 피드백', () => {
  it('기본 API 모드이며 명시적으로 비활성화할 수 있다', () => {
    vi.stubEnv('NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE', undefined);
    expect(getFeedbackMode()).toBe('api');
    vi.stubEnv('NEXT_PUBLIC_DIAGNOSIS_FEEDBACK_MODE', 'disabled');
    expect(getFeedbackMode()).toBe('disabled');
  });
  it('미리보기는 조회·저장 API를 호출하지 않고 실제 저장이 아님을 안내한다', async () => {
    const user = userEvent.setup();
    render(<DiagnosisFeedback mode="preview" />);
    await user.click(await ready());
    await user.click(screen.getByRole('button', { name: '피드백 미리보기' }));
    expect(screen.getByRole('status')).toHaveTextContent('실제 의견은 저장되지 않았어요');
    expect(feedbackApi.saveDiagnosisFeedback).not.toHaveBeenCalled();
    expect(feedbackApi.getDiagnosisFeedback).not.toHaveBeenCalled();
  });
  it('저장 전에는 입력을 받지 않고 결과 저장을 안내한다', () => {
    render(<DiagnosisFeedback mode="api" />);
    expect(screen.getByText(/진단 결과를 먼저 저장/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '의견 보내기' })).not.toBeInTheDocument();
    expect(feedbackApi.getDiagnosisFeedback).not.toHaveBeenCalled();
  });
  it('전송 실패 후 내용을 유지해 평가·이유·의견만 다시 전송한다', async () => {
    const user = userEvent.setup();
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockRejectedValueOnce(
      new ApiError('RISK_REPORT_STORE_UNAVAILABLE', '실패', 503)
    );
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await ready();
    await user.click(screen.getByRole('button', { name: '아쉬워요' }));
    await user.click(screen.getByRole('button', { name: '진단이 실제와 달라요' }));
    await user.type(screen.getByRole('textbox'), '다시 확인해 주세요');
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(screen.getByRole('alert')).toHaveTextContent('저장소에 잠시 연결');
    expect(screen.getByRole('textbox')).toHaveValue('다시 확인해 주세요');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(await screen.findByRole('status')).toHaveTextContent('감사해요');
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenLastCalledWith('risk-1', {
      schema_version: 1,
      rating: 'bad',
      reasons: ['incorrect_result'],
      comment: '다시 확인해 주세요',
    });
  });
  it('저장된 의견을 불러오고 평가를 변경하면 이전 사유를 제거한다', async () => {
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockResolvedValue(stored);
    const user = userEvent.setup();
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    expect(await screen.findByRole('textbox')).toHaveValue('기존 의견');
    expect(screen.getByRole('textbox')).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '의견 수정' }));
    await user.click(screen.getByRole('button', { name: '도움이 됐어요' }));
    await user.clear(screen.getByRole('textbox'));
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenCalledWith('risk-1', {
      schema_version: 1,
      rating: 'good',
      reasons: [],
      comment: '',
    });
  });
  it('조회 실패를 의견 없음으로 간주하지 않고 재조회 후 작성한다', async () => {
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockRejectedValueOnce(new Error('network'));
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('불러오지 못했어요');
    expect(screen.queryByRole('button', { name: '의견 보내기' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '다시 불러오기' }));
    await ready();
    expect(screen.getByRole('button', { name: '의견 보내기' })).toBeEnabled();
  });
  it.each([
    [403, '접근할 권한'],
    [404, '진단을 찾을 수'],
  ])('%s 조회 오류를 구분한다', async (status, message) => {
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockRejectedValue(new ApiError('ERROR', '실패', status));
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
  });
  it('삭제 취소는 요청하지 않고 삭제 실패 시 원본을 유지하다 재시도로 초기화한다', async () => {
    const user = userEvent.setup();
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockResolvedValue(stored);
    vi.mocked(feedbackApi.deleteDiagnosisFeedback).mockRejectedValueOnce(new Error('network'));
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await user.click(await screen.findByRole('button', { name: '의견 삭제' }));
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(feedbackApi.deleteDiagnosisFeedback).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '의견 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제 확인' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('삭제하지 못했어요');
    expect(screen.getByRole('textbox')).toHaveValue('기존 의견');
    await user.click(screen.getByRole('button', { name: '의견 삭제' }));
    await user.click(screen.getByRole('button', { name: '삭제 확인' }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '의견 보내기' })).toBeEnabled();
    expect(feedbackApi.deleteDiagnosisFeedback).toHaveBeenLastCalledWith('risk-1');
  });
  it('409 최신 조회가 실패해도 초안을 보존하고 사용자가 결정하기 전에는 재전송하지 않는다', async () => {
    const user = userEvent.setup();
    vi.mocked(feedbackApi.getDiagnosisFeedback)
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(stored);
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockRejectedValueOnce(
      new ApiError('RISK_FEEDBACK_CONFLICT', '충돌', 409)
    );
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await user.click(await ready());
    await user.type(screen.getByRole('textbox'), '내 초안');
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('최신 의견을 불러오지 못했어요');
    expect(screen.getByRole('textbox')).toHaveValue('내 초안');
    await user.click(screen.getByRole('button', { name: '최신 의견 다시 불러오기' }));
    expect(await screen.findByText('기존 의견')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('내 초안');
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: '작성한 내용 유지' }));
    expect(screen.getByRole('textbox')).toBeEnabled();
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenLastCalledWith(
      'risk-1',
      expect.objectContaining({ rating: 'good', comment: '내 초안' })
    );
  });
  it('충돌 후 사용자가 최신 의견을 선택하면 그때 입력을 교체한다', async () => {
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockResolvedValueOnce(null).mockResolvedValueOnce(stored);
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockRejectedValueOnce(
      new ApiError('RISK_FEEDBACK_CONFLICT', '충돌', 409)
    );
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await userEvent.click(await ready());
    await userEvent.click(screen.getByRole('button', { name: '의견 보내기' }));
    await userEvent.click(await screen.findByRole('button', { name: '최신 의견 불러오기' }));
    expect(screen.getByRole('textbox')).toHaveValue('기존 의견');
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenCalledTimes(1);
  });
  it('진단을 이동하면 이전 요청의 늦은 응답을 무시한다', async () => {
    let resolveFirst!: (value: feedbackApi.DiagnosisFeedback | null) => void;
    vi.mocked(feedbackApi.getDiagnosisFeedback).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve;
        })
    );
    const view = render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    view.rerender(<DiagnosisFeedback reportId="risk-2" mode="api" />);
    await ready();
    await act(async () => resolveFirst(stored));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '의견 삭제' })).not.toBeInTheDocument();
  });
  it('전송 중 연속 클릭해도 한 번만 저장한다', async () => {
    let resolveSave!: () => void;
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        })
    );
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await userEvent.click(await ready());
    await userEvent.dblClick(screen.getByRole('button', { name: '의견 보내기' }));
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenCalledTimes(1);
    await act(async () => resolveSave());
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('감사해요'));
  });
});
