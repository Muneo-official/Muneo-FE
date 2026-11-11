import { expect as baseExpect, test, type Page } from '@playwright/test';

const expect = baseExpect.configure({ timeout: 30_000 });
test.setTimeout(90_000);

async function fillAnalysis(page: Page) {
  for (const [id, option] of Object.entries({
    spaceType: '아파트',
    elevator: '있음',
    region: '서울',
    buildingAge: '10~20년',
  })) {
    await page.locator('#' + id).click();
    await page.getByRole('option', { name: option, exact: true }).click();
  }
  await page.getByLabel('면적 (평)').fill('25');
  await page.getByLabel('방 개수').fill('3');
  await page.getByLabel('층수').fill('5');
  await page.getByLabel('업체명').fill('테스트 업체');
  await page
    .getByLabel('견적서 파일', { exact: true })
    .setInputFiles({ name: 'estimate.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 test') });
}
async function expectTrialReport(page: Page) {
  await expect(page.getByRole('heading', { name: '진단 레포트' })).toBeVisible();
  await expect(page.getByText('폐기물 처리 비용 확인', { exact: true }).first()).toBeVisible();
}
async function analyze(page: Page) {
  await page.goto('/try/analysis');
  await fillAnalysis(page);
  await page.getByRole('button', { name: '분석 시작' }).click();
  await expectTrialReport(page);
}
async function login(page: Page) {
  await page.getByPlaceholder('name@example.com').fill('tester@muneo.test');
  await page.getByPlaceholder('비밀번호를 입력하세요').fill('Correct123');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
}

test('비회원 진단은 일부만 응답하고 로그인 후 재분석 없이 전체 결과를 보여준다', async ({ page }, testInfo) => {
  let posts = 0;
  page.on('request', (request) => {
    if (request.url().endsWith('/api/v1/trials/analysis') && request.method() === 'POST') posts++;
  });
  await page.goto('/try/analysis');
  await fillAnalysis(page);
  await page.screenshot({ path: testInfo.outputPath('trial-input.png'), fullPage: true });
  const response = page.waitForResponse(
    (r) => r.url().endsWith('/api/v1/trials/analysis') && r.request().method() === 'POST'
  );
  await page.getByRole('button', { name: '분석 시작' }).click();
  // 실제 서비스와 같은 로딩 화면을 쓴다.
  await expect(page.getByText('업로드하신 견적서를 읽고 있어요')).toBeVisible();
  const body = await (await response).text();
  expect(body).not.toContain('비공개 전체 항목');
  expect(body).toContain('도배 공사');
  await expectTrialReport(page);
  // 대표 공정은 전부 공개하고, 잠긴 공정은 이름과 건수만 보여준다.
  await expect(page.getByText('운반과 처리 비용이 포함되어 있나요?', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /도배 공사.*확인 필요 1건/ })).toBeVisible();
  await expect(page.getByText('비공개 전체 항목: 도배 인건비', { exact: true })).toHaveCount(0);
  await expect(page.getByText('나머지 1개 공정의 진단이 잠겨 있어요')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('trial-preview.png'), fullPage: true });
  await page.getByRole('link', { name: '로그인하고 전체 결과 보기' }).click();
  await expect(page.getByRole('dialog', { name: '로그인' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expectTrialReport(page);
  await page.getByRole('link', { name: '로그인하고 전체 결과 보기' }).click();
  await login(page);
  await expect(page).toHaveURL('/analysis/trial');
  await expect(page.getByText('잠겨 있던 결과를 모두 열었어요.')).toBeVisible();
  await expect(page.getByText('비공개 전체 항목: 도배 인건비', { exact: true }).first()).toBeVisible();
  expect(posts).toBe(1);
});

test('새로고침으로 결과를 복원하고 회원가입 후 전체 결과로 이어진다', async ({ page }) => {
  await analyze(page);
  await page.reload();
  await expectTrialReport(page);
  await page.getByRole('link', { name: '처음이신가요? 무료 회원가입' }).click();
  const values = {
    이메일: 'trial@muneo.test',
    비밀번호: 'StrongPw!23',
    '비밀번호 확인': 'StrongPw!23',
    이름: '테스트',
    연락처: '010-1234-5678',
    생년월일: '1995-05-15',
  };
  for (const [label, value] of Object.entries(values)) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByRole('button', { name: '가입하기' }).click();
  await expect(page).toHaveURL('/analysis/trial');
  await expect(page.getByText('비공개 전체 항목: 도배 인건비', { exact: true }).first()).toBeVisible();
});

test('취소와 서버 오류 후 입력과 첨부 파일을 유지한다', async ({ page }) => {
  let release: () => void = () => {};
  const blocked = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/v1/trials/analysis', async (route) => {
    if (route.request().method() === 'GET') return route.continue();
    await blocked;
    await route.fulfill({ status: 503, json: { message: '잠시 후 다시 시도해 주세요.' } }).catch(() => {});
  });
  await page.goto('/try/analysis');
  await fillAnalysis(page);
  await page.getByRole('button', { name: '분석 시작' }).click();
  await page.getByRole('button', { name: '취소', exact: true }).click();
  await expect(page.getByLabel('업체명')).toHaveValue('테스트 업체');
  await expect(page.getByText('estimate.pdf', { exact: true }).first()).toBeVisible();
  release();
  await page.getByRole('button', { name: '분석 시작' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('잠시 후 다시 시도');
  await expect(page.getByLabel('업체명')).toHaveValue('테스트 업체');
  await page.unroute('**/api/v1/trials/analysis');
  await page.getByRole('button', { name: '분석 시작' }).click();
  await expectTrialReport(page);
});

test('만료된 결과는 빈 화면 대신 재시작 안내를 보여준다', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'access_token', value: 'mock-access', url: baseURL!, httpOnly: true }]);
  await page.goto('/analysis/trial');
  await expect(page.getByRole('heading', { name: '체험 결과의 보관 시간이 지났어요' })).toBeVisible();
});

test('카카오 로그인 후 같은 전체 결과로 돌아온다', async ({ page, context, baseURL }) => {
  await analyze(page);
  await page.getByRole('link', { name: '로그인하고 전체 결과 보기' }).click();
  await page.route('**/api/v1/auth/oauth/kakao', async (route) => {
    await context.addCookies([{ name: 'access_token', value: 'mock-access', url: baseURL!, httpOnly: true }]);
    await route.fulfill({ json: { result: { provider: 'kakao', loginUrl: baseURL + '/auth/callback/success' } } });
  });
  await page.getByRole('button', { name: '카카오 로그인' }).click();
  await expect(page).toHaveURL('/analysis/trial');
  await expect(page.getByText('비공개 전체 항목: 도배 인건비', { exact: true }).first()).toBeVisible();
});

test('가견적도 한 공정 공개 후 전체 결과로 이어진다', async ({ page }, testInfo) => {
  await page.route('**/api/v1/trials/estimate', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    const response = await route.fetch();
    const body = await response.text();
    expect(body).not.toContain('비공개 전체 항목');
    expect(body).not.toContain('3900000');
    await route.fulfill({ response, body });
  });
  await page.goto('/try/estimate');
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
  await page.getByRole('button', { name: /도배.*벽면/ }).click();
  for (const name of ['실크벽지', '전체(벽면+천장)', '포함'])
    await page.getByRole('button', { name, exact: true }).click();
  await page.getByRole('button', { name: /도어.*방문/ }).click();
  await page.getByRole('button', { name: '다음 단계' }).click();
  for (const name of ['10년 이하', '있음', '공실', '가능', '미정'])
    await page.getByRole('button', { name, exact: true }).click();
  await page.getByLabel('층수').fill('5');
  await page.getByRole('button', { name: '다음 단계' }).click();
  // 대표 공정(도배)은 세부 항목까지 공개하고, 도어와 총 견적은 잠근다.
  await expect(page.getByText('실크 벽지 시공', { exact: true })).toBeVisible();
  await expect(page.getByText('100만원 ~ 200만원').first()).toBeVisible();
  await expect(page.getByRole('link', { name: '로그인하고 도어 세부 견적 보기' })).toBeVisible();
  await expect(page.getByText('나머지 1개 공정과 총 견적이 잠겨 있어요')).toBeVisible();
  await expect(page.getByText('비공개 전체 항목', { exact: false })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('trial-estimate-preview.png'), fullPage: true });
  await page.getByRole('link', { name: '로그인하고 전체 결과 보기' }).click();
  await login(page);
  await expect(page).toHaveURL('/estimate/trial');
  await expect(page.getByText('비공개 전체 항목: 도어 세부', { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('trial-estimate-unlocked.png'), fullPage: true });
  await expect(page.getByRole('button', { name: '내 분석 이력에 저장' })).toBeVisible();
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(width + 'px 체험 입력과 결과가 넘치지 않는다', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/try/analysis');
    await fillAnalysis(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: '분석 시작' }).click();
    await expectTrialReport(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) await page.screenshot({ path: testInfo.outputPath('trial-mobile.png'), fullPage: true });
  });
}
