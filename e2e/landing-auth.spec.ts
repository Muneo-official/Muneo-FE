import { expect as baseExpect, test } from '@playwright/test';

const expect = baseExpect.configure({ timeout: 30_000 });
test.setTimeout(90_000);

test('카카오 신규 가입을 완료해도 선택한 진단으로 연결된다', async ({ page, context, baseURL }) => {
  await page.goto('/login?next=%2Fanalysis');
  await page.route('**/api/v1/auth/oauth/kakao', (route) =>
    route.fulfill({
      json: { result: { provider: 'kakao', loginUrl: `${baseURL}/auth/callback/signup?ticket=mock-ticket` } },
    })
  );
  await page.route('**/api/v1/auth/social/signup', async (route) => {
    await context.addCookies([{ name: 'access_token', value: 'mock-access', url: baseURL!, httpOnly: true }]);
    await route.fulfill({ json: { result: {} } });
  });
  await page.getByRole('button', { name: '카카오 로그인' }).click();
  await expect(page).toHaveURL(/\/auth\/callback\/signup/);
  await page.getByLabel('이름', { exact: true }).fill('테스트');
  await page.getByLabel('연락처', { exact: true }).fill('010-1234-5678');
  await page.getByLabel('생년월일', { exact: true }).fill('1995-05-15');
  await page.getByRole('button', { name: '가입하기' }).click();
  await expect(page).toHaveURL('/analysis', { timeout: 15_000 });
});

test('카카오 인증 실패 후 재시도에도 선택한 기능을 유지한다', async ({ page, baseURL }) => {
  await page.goto('/login?next=%2Festimate');
  await page.route('**/api/v1/auth/oauth/kakao', (route) =>
    route.fulfill({
      json: { result: { provider: 'kakao', loginUrl: `${baseURL}/auth/callback/error?reason=SOCIAL_LOGIN_FAILED` } },
    })
  );
  await page.getByRole('button', { name: '카카오 로그인' }).click();
  await page.getByRole('button', { name: '다시 로그인하기' }).click();
  await expect(page).toHaveURL('/login?next=%2Festimate');
});
