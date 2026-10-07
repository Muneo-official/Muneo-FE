import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as feedbackApi from '@/api/feedback';
import { DiagnosisFeedback } from './DiagnosisFeedback';

vi.mock('@/api/feedback', async (importOriginal) => ({
  ...(await importOriginal<typeof feedbackApi>()),
  saveDiagnosisFeedback: vi.fn(),
}));
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
});

describe('진단 피드백', () => {
  it('미리보기는 API를 호출하지 않고 실제 저장이 아님을 안내한다', async () => {
    const user = userEvent.setup();
    render(<DiagnosisFeedback mode="preview" />);
    await user.click(screen.getByRole('button', { name: '도움이 됐어요' }));
    await user.click(screen.getByRole('button', { name: '피드백 미리보기' }));
    expect(screen.getByRole('status')).toHaveTextContent('실제 의견은 저장되지 않았어요');
    expect(feedbackApi.saveDiagnosisFeedback).not.toHaveBeenCalled();
  });
  it('저장 전 결과는 서버 피드백을 보내지 않는다', async () => {
    const user = userEvent.setup();
    render(<DiagnosisFeedback mode="api" />);
    await user.click(screen.getByRole('button', { name: '아쉬워요' }));
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(screen.getByRole('alert')).toHaveTextContent('진단 결과를 먼저 저장');
    expect(feedbackApi.saveDiagnosisFeedback).not.toHaveBeenCalled();
  });
  it('전송 실패 후 내용을 유지해 평가·이유·의견만 다시 전송한다', async () => {
    const user = userEvent.setup();
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce();
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await user.click(screen.getByRole('button', { name: '아쉬워요' }));
    await user.click(screen.getByRole('button', { name: '진단이 실제와 달라요' }));
    await user.type(screen.getByRole('textbox'), '다시 확인해 주세요');
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(screen.getByRole('alert')).toHaveTextContent('보내지 못했어요');
    expect(screen.getByRole('textbox')).toHaveValue('다시 확인해 주세요');
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(await screen.findByRole('status')).toHaveTextContent('감사해요');
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenLastCalledWith('risk-1', {
      schema_version: 1,
      rating: 'bad',
      reasons: ['incorrect_result'],
      comment: '다시 확인해 주세요',
    });
  });
  it('평가를 바꾸면 이전 평가의 선택 이유를 제거한다', async () => {
    const user = userEvent.setup();
    vi.mocked(feedbackApi.saveDiagnosisFeedback).mockResolvedValueOnce();
    render(<DiagnosisFeedback reportId="risk-1" mode="api" />);
    await user.click(screen.getByRole('button', { name: '아쉬워요' }));
    await user.click(screen.getByRole('button', { name: '진단이 실제와 달라요' }));
    await user.click(screen.getByRole('button', { name: '도움이 됐어요' }));
    await user.click(screen.getByRole('button', { name: '의견 보내기' }));
    expect(feedbackApi.saveDiagnosisFeedback).toHaveBeenCalledWith(
      'risk-1',
      expect.objectContaining({ rating: 'good', reasons: [] })
    );
  });
});
