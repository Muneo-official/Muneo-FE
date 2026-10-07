import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText('가상 데이터 QA:', { exact: false })).toBeVisible();
  await page.getByLabel('이메일', { exact: true }).fill('admin@example.test');
  await page.getByLabel('비밀번호', { exact: true }).fill('MuneoQa123!');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL(/\/users$/);
});

test('로그인 → 사용자별 저장 기록 → 페이지 이동 → 진단·피드백 → 서버 로그아웃', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.getByRole('button', { name: '기록 있는 사용자 사용자 상세 보기' }).click();
  await expect(page.getByText('예상 견적 총 21건')).toBeVisible();
  await page.locator('summary').filter({ hasText: '저장한 예상 견적' }).first().click();
  await expect(page.getByText('총 예상 견적 (원)', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: '다음', exact: true }).click();
  await expect(page.getByText('2 / 3 페이지')).toBeVisible();
  await page.getByRole('button', { name: '다음', exact: true }).click();
  await expect(page.getByText('3 / 3 페이지')).toBeVisible();
  await expect(page.locator('summary').filter({ hasText: '저장한 예상 견적' })).toHaveCount(1);
  await page.getByRole('button', { name: '견적서 진단', exact: true }).click();
  await page.locator('summary').filter({ hasText: '저장한 견적서 진단' }).click();
  await expect(page.getByText('확인할 항목 2개')).toBeVisible();
  await page.locator('summary').filter({ hasText: '욕실 공사' }).click();
  await expect(page.getByText('방수 공사 범위', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '진단 피드백', exact: true }).click();
  await page.locator('summary').filter({ hasText: '도움이 됐어요' }).click();
  await expect(page.getByText('진단 ID: qa-report-1', { exact: true })).toBeVisible();
  await expect(page.getByText('놓친 항목을 찾았어요', { exact: true })).toBeVisible();
  await page.getByRole('heading', { name: '사용자 이용 내역' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/muneo-admin-feedback-desktop.png' });
  await page.getByRole('button', { name: '로그아웃', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/users/101');
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});

test('모바일에서 빈 기록·API 미연결·장애·소유자 불일치·권한 부족을 구분한다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cases = [
    [102, '저장된 예상 견적 기록이 없습니다.'],
    [103, '조회 API가 아직 제공되지 않거나 사용자를 찾을 수 없습니다. API 연결 상태를 확인해 주세요.'],
    [104, '서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.'],
    [105, '선택한 사용자와 데이터 소유자가 일치하지 않습니다. 데이터 표시를 중단했습니다.'],
    [106, '이 데이터를 조회할 관리자 권한이 없습니다.'],
  ] as const;
  for (const [id, message] of cases) {
    await page.goto(`/users/${id}`);
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    await expect(page.getByText('ID: qa-estimate-21', { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.getByRole('heading', { name: '사용자 이용 내역' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/muneo-admin-permission-mobile.png', fullPage: true });
});
