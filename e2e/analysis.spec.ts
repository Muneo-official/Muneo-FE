import { expect, test } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Analysis — authenticated', () => {
  test('공사 정보 입력 필드와 드래그앤드롭 영역이 표시된다', async ({ page }) => {
    await page.goto('/analysis');
    await expect(page.getByLabel('업체명')).toBeVisible();
    await expect(page.getByLabel('면적 (평)')).toBeVisible();
    await expect(page.getByText('파일을 드래그하거나 클릭하여 업로드')).toBeVisible();
  });

  test('필수 필드 미입력 상태에서 분석 시작 시 에러가 노출된다', async ({ page }) => {
    await page.goto('/analysis');
    const startButton = page.getByRole('button', { name: '분석 시작' });
    await startButton.click();
    await expect(page.getByText(/공사 정보를 모두 입력/)).toBeVisible();
  });

  test('초기화 버튼이 업로드 파일 목록을 비운다', async ({ page }) => {
    await page.goto('/analysis');
    // file input 발견을 위해 hidden input을 직접 셀렉트
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      { name: 'sample.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') },
    ]);
    await expect(page.getByText('sample.pdf')).toBeVisible();
    await page.getByRole('button', { name: /초기화/ }).click();
    await expect(page.getByText('sample.pdf')).not.toBeVisible();
  });
});
