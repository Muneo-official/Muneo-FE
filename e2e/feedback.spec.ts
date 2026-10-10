import { expect, test } from '@playwright/test';

const endpoint = '/api/v1/risk-detector/risk-1/feedback';
test.use({ storageState: 'playwright/.auth/user.json' });
test.beforeEach(async ({ request }) => {
  expect((await request.delete(endpoint)).status()).toBe(204);
});

test('피드백 저장·새로고침 복원·수정·삭제가 프록시와 API를 통해 이어진다', async ({ page, request }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/history/risk-1');
  const feedback = page.getByRole('region', { name: '이 진단이 도움이 되었나요?' });
  await feedback.getByRole('button', { name: '아쉬워요' }).click();
  await feedback.getByRole('button', { name: '진단이 실제와 달라요' }).click();
  await feedback.getByRole('textbox').fill('QA 초안 의견');
  const put = page.waitForResponse(
    (response) => response.url().endsWith(endpoint) && response.request().method() === 'PUT'
  );
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  const response = await put;
  expect(response.status()).toBe(204);
  expect((await (await request.get(endpoint)).json()).result).toMatchObject({
    schema_version: 1,
    rating: 'bad',
    reasons: ['incorrect_result'],
    comment: 'QA 초안 의견',
    item_reviews: [],
  });
  await expect(feedback.getByRole('status')).toContainText('감사해요');
  await page.reload();
  await expect(feedback.getByRole('textbox')).toHaveValue('QA 초안 의견');
  await expect(feedback.getByRole('textbox')).toBeDisabled();
  await feedback.getByRole('button', { name: '의견 수정' }).click();
  await feedback.getByRole('button', { name: '도움이 됐어요' }).click();
  await feedback.getByRole('textbox').fill('');
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  await expect(feedback.getByRole('status')).toContainText('감사해요');
  expect((await (await request.get(endpoint)).json()).result).toMatchObject({
    rating: 'good',
    reasons: [],
    comment: '',
  });
  await feedback.getByRole('button', { name: '의견 삭제' }).click();
  await expect(feedback.getByText(/진단 결과는 그대로 유지/)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('feedback-delete-mobile.png'), fullPage: true });
  await feedback.getByRole('button', { name: '삭제 확인' }).click();
  await expect(feedback.getByRole('button', { name: '의견 보내기' })).toBeVisible();
  expect((await request.get(endpoint)).status()).toBe(204);
  await page.reload();
  await expect(feedback.getByRole('button', { name: '의견 보내기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '진단 레포트', exact: true })).toBeVisible();
  await expect(page.getByText('A업체 · 25평 아파트 · 분석일 2026.05.18', { exact: true })).toBeVisible();
});

test('409 충돌 시 최신 의견과 초안을 구분하고 선택 후에만 재전송한다', async ({ page, request }, testInfo) => {
  await page.goto('/history/risk-1');
  const feedback = page.getByRole('region', { name: '이 진단이 도움이 되었나요?' });
  await feedback.getByRole('button', { name: '도움이 됐어요' }).click();
  await feedback.getByRole('textbox').fill('현재 화면의 초안');
  expect(
    (
      await request.put(endpoint, {
        data: {
          schema_version: 1,
          rating: 'bad',
          reasons: ['missing_risks'],
          comment: '다른 화면에서 수정한 의견',
          item_reviews: [],
        },
      })
    ).status()
  ).toBe(204);
  let attempts = 0;
  await page.route(`**${endpoint}`, async (route) => {
    if (route.request().method() === 'PUT' && ++attempts === 1) {
      await route.fulfill({
        status: 409,
        json: { success: false, code: 'RISK_FEEDBACK_CONFLICT', message: '동시 수정' },
      });
    } else await route.continue();
  });
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  await expect(feedback.getByText('다른 화면에서 수정한 의견')).toBeVisible();
  await expect(feedback.getByRole('textbox')).toHaveValue('현재 화면의 초안');
  expect(attempts).toBe(1);
  await page.screenshot({ path: testInfo.outputPath('feedback-conflict-desktop.png'), fullPage: true });
  await feedback.getByRole('button', { name: '작성한 내용 유지' }).click();
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  await expect(feedback.getByRole('status')).toContainText('감사해요');
  expect(attempts).toBe(2);
  expect((await (await request.get(endpoint)).json()).result.comment).toBe('현재 화면의 초안');
});

test('503 점검 안내를 닫으면 피드백 초안을 유지하며 재시도할 수 있다', async ({ page }) => {
  await page.goto('/history/risk-1');
  const feedback = page.getByRole('region', { name: '이 진단이 도움이 되었나요?' });
  await feedback.getByRole('button', { name: '아쉬워요' }).click();
  await feedback.getByRole('textbox').fill('장애 중에도 유지할 의견');
  let attempts = 0;
  await page.route(`**${endpoint}`, async (route) => {
    if (route.request().method() === 'PUT' && ++attempts === 1) {
      await route.fulfill({
        status: 503,
        json: { success: false, code: 'RISK_REPORT_STORE_UNAVAILABLE', message: '저장소 장애' },
      });
    } else await route.continue();
  });
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  await expect(page.getByRole('dialog', { name: '문어에 잠시 연결할 수 없어요' })).toBeVisible();
  await page.getByRole('button', { name: '입력 화면으로 돌아가기' }).click();
  await expect(feedback.getByRole('textbox')).toHaveValue('장애 중에도 유지할 의견');
  await expect(feedback.getByRole('alert')).toContainText('작성한 내용은 유지');
  await feedback.getByRole('button', { name: '의견 보내기' }).click();
  await expect(feedback.getByRole('status')).toContainText('감사해요');
  expect(attempts).toBe(2);
});
