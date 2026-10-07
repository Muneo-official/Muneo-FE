import { expect, test } from '@playwright/test';

test('진단 미리보기에서 질문과 good/bad 피드백을 체험한다', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/preview/diagnosis');
  await expect(page.getByRole('heading', { name: '3개 항목을 업체와 확인해 주세요' })).toBeVisible();
  await page.getByRole('button', { name: '아쉬워요' }).click();
  await page.getByRole('button', { name: '진단이 실제와 달라요' }).click();
  await page.getByRole('textbox').fill('업체에 확인할 내용을 찾는 데 도움이 됐어요.');
  await page.getByRole('button', { name: '피드백 미리보기' }).click();
  await expect(page.getByRole('status')).toContainText('실제 의견은 저장되지 않았어요');
  await page.screenshot({ path: testInfo.outputPath('feedback-mobile.png'), fullPage: true });
  await page.getByRole('button', { name: '의견 수정' }).click();
  await expect(page.getByRole('textbox')).toHaveValue('업체에 확인할 내용을 찾는 데 도움이 됐어요.');
});

test('서버 503 안내를 닫아도 로그인 입력이 유지된다', async ({ page }, testInfo) => {
  await page.goto('/login');
  await page.route('**/api/v1/users/login', (route) =>
    route.fulfill({ status: 503, contentType: 'application/json', body: '{"code":"MAINTENANCE"}' })
  );
  await page.getByPlaceholder('name@example.com').fill('tester@muneo.test');
  await page.getByPlaceholder('비밀번호를 입력하세요').fill('Correct123');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '문어에 잠시 연결할 수 없어요' });
  await expect(dialog).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('maintenance-dialog.png') });
  await page.getByRole('button', { name: '입력 화면으로 돌아가기' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByPlaceholder('name@example.com')).toHaveValue('tester@muneo.test');
  await expect(page.getByPlaceholder('비밀번호를 입력하세요')).toHaveValue('Correct123');
});

test('이메일 로그인은 사용자가 가려던 진단 화면으로 복귀한다', async ({ page }) => {
  await page.goto('/login?next=%2Fanalysis');
  await page.getByPlaceholder('name@example.com').fill('tester@muneo.test');
  await page.getByPlaceholder('비밀번호를 입력하세요').fill('Correct123');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL(/\/analysis$/, { timeout: 15_000 });
});

test.describe('가견적 필수 입력', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('미입력 시 진행을 막고 선택한 공정만 검증한다', async ({ page }) => {
    await page.goto('/estimate');
    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.getByRole('alert').filter({ hasText: '화장실 개수' })).toBeVisible();
    await page.getByRole('button', { name: '서울', exact: true }).click();
    await page.getByRole('button', { name: '아파트', exact: true }).click();
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
    await page.getByRole('button', { name: '부분 시공', exact: true }).click();
    await page.getByRole('button', { name: /주방 싱크대/ }).click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.getByRole('alert').filter({ hasText: '싱크대 형태' })).toBeVisible();
    await expect(page.getByRole('button', { name: '주방 · 입력 필요', exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: /도배 · 입력/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'ㄷ자', exact: true }).click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.getByRole('heading', { name: /Step 3/ })).toBeVisible();
  });
});
