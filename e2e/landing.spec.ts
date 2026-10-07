import { expect, test } from '@playwright/test';

test.describe('Landing page', () => {
  test('비로그인 상태에서 랜딩 페이지 주요 섹션이 렌더링된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/문어/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'AI 상담 챗 열기' })).toHaveCount(0);
  });

  test('Hero CTA 클릭 시 /login 인터셉팅 모달이 열린다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '무료로 시작하기' }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });

  test('인터셉팅 모달은 ESC로 닫힌다', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '무료로 시작하기' }).click();
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder('name@example.com')).not.toBeVisible();
  });

  test('/login 직접 접근은 전체 페이지로 렌더된다', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });
});
