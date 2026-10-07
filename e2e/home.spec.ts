import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Home — authenticated', () => {
  test('홈 페이지에 사용자 이름과 시작 버튼이 표시된다', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('문어테스터');
    await expect(page.getByRole('link', { name: /견적서 진단하기/ })).toBeVisible();
  });

  test('최근 이력 행 클릭 시 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto('/home');
    const rows = page.locator('tr[role="link"]');
    await expect(rows.first()).toBeVisible({ timeout: 10_000 });
    await Promise.all([page.waitForURL(/\/history\//, { timeout: 10_000 }), rows.first().click()]);
  });
});
