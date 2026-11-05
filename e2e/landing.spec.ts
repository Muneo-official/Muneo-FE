import { expect as baseExpect, test } from '@playwright/test';

// 개발 서버의 첫 모달·기능 페이지 컴파일 시간을 포함한다.
const expect = baseExpect.configure({ timeout: 30_000 });
test.setTimeout(90_000);

test.describe('Landing page', () => {
  test('비로그인 상태에서 랜딩 페이지 주요 섹션이 렌더링된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/문어/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'AI 상담 챗 열기' })).toHaveCount(0);
  });

  test('진단 CTA는 로그인 없이 체험 입력으로 이동한다', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-section').getByRole('link', { name: '무료로 진단하기' }).click();
    await expect(page).toHaveURL('/try/analysis');
    await expect(page.getByLabel('업체명')).toBeVisible();
  });

  test('/login 직접 접근은 전체 페이지로 렌더된다', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  });
});

test('가견적 CTA도 로그인 없이 입력으로 이동한다', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('hero-section').getByRole('link', { name: '가견적서 만들기' }).click();
  await expect(page).toHaveURL('/try/estimate');
  await expect(page.getByLabel('전용 면적')).toBeVisible();
});

test('전체 로그인 페이지에서도 회원가입 전환 시 목적지가 유지된다', async ({ page }) => {
  await page.goto('/login?next=%2Festimate');
  await page.getByRole('button', { name: '회원가입', exact: true }).click();
  await expect(page).toHaveURL('/signup?next=%2Festimate');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await expect(page).toHaveURL('/login?next=%2Festimate');
});

test('진단 예시는 가입 없이 열리고 실제 이용은 체험으로 연결된다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '가입 없이 결과 예시 보기' }).click();
  await expect(page).toHaveURL('/preview/diagnosis');
  await expect(page.getByText('진단 결과 예시 · 실제 고객 자료가 아닙니다')).toBeVisible();
  await page.getByRole('link', { name: '무료로 진단하기' }).click();
  await expect(page).toHaveURL('/try/analysis');
});

test('개인정보 FAQ와 하단 시작 버튼을 사용할 수 있다', async ({ page }) => {
  await page.goto('/');
  const question = page.getByRole('button', { name: '업로드한 견적서는 어떻게 처리되나요?' });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  const policy = page.getByRole('link', { name: '개인정보 처리방침 확인하기' });
  await expect(policy).toBeVisible();
  await expect(policy).toHaveAttribute('href', '/privacy');
  await expect(page.getByText(/분석 직후 자동 삭제를 보장하지 않아요/)).toBeVisible();
  await page.locator('#start').getByRole('link', { name: '무료로 진단하기' }).click();
  await expect(page).toHaveURL('/try/analysis');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`${width}px 랜딩에서 내용과 시작 버튼이 가로로 넘치지 않는다`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    for (const id of ['intro', 'guide', 'faq', 'start']) {
      const section = page.locator('#' + id);
      await section.scrollIntoViewIfNeeded();
      await expect(section.getByRole('heading', { level: 2 })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('landing.png'), fullPage: true });
    }
  });
}

test('카카오 인증 후에도 가견적 선택을 유지한다', async ({ page, context, baseURL }) => {
  await page.goto('/login?next=%2Festimate');
  await page.route('**/api/v1/auth/oauth/kakao', async (route) => {
    await context.addCookies([{ name: 'access_token', value: 'mock-access', url: baseURL!, httpOnly: true }]);
    await route.fulfill({
      json: { result: { provider: 'kakao', loginUrl: `${baseURL}/auth/callback/success` } },
    });
  });
  await page.getByRole('button', { name: '카카오 로그인' }).click();
  await expect(page).toHaveURL('/estimate', { timeout: 15_000 });
  expect(await page.evaluate(() => sessionStorage.getItem('muneo:social-auth-return'))).toBeNull();
});
