import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Estimate — authenticated', () => {
  test('가견적 페이지 진입 시 Step1 기본 정보가 표시된다', async ({ page }) => {
    await page.goto('/estimate');
    await expect(page).toHaveURL(/\/estimate/);
    await expect(page.getByRole('heading', { name: /기본 정보/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '다음 단계' })).toBeVisible();
  });

  test('전용 면적에 음수 입력은 React 컨트롤드 input이 차단한다', async ({ page }) => {
    await page.goto('/estimate');
    const area = page.getByLabel('전용 면적');
    await expect(area).toHaveAttribute('type', 'number');
    await expect(area).toHaveAttribute('min', '1');
    await area.fill('-5');
    // parsePositiveNumber가 음수를 null로 만들어 input value가 비워짐
    await expect(area).toHaveValue('');
  });

  test('Step1 입력 후 다음 단계로 진행하면 Step2가 표시된다', async ({ page }) => {
    await page.goto('/estimate');
    await page.getByRole('button', { name: '서울' }).click();
    await page.getByRole('button', { name: '아파트' }).click();
    await page.getByLabel('전용 면적').fill('25');
    await page
      .getByRole('group', { name: '방 개수', exact: true })
      .getByRole('button', { name: '3개', exact: true })
      .click();
    await page
      .getByRole('group', { name: '화장실 개수', exact: true })
      .getByRole('button', { name: '2개', exact: true })
      .click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.getByRole('heading', { name: /시공 대상 공정/ })).toBeVisible();
  });
});
