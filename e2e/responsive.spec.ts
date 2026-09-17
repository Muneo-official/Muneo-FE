import { expect, type Page, test } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: Page) => {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const containers = [document.documentElement, ...document.querySelectorAll('main')];
        return containers.every((element) => element.scrollWidth <= element.clientWidth + 1);
      })
    )
    .toBe(true);
};

test.use({ storageState: 'playwright/.auth/user.json', contextOptions: { reducedMotion: 'reduce' } });

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`${width}px에서 주요 페이지가 가로로 넘치지 않는다`, async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      '/',
      '/login',
      '/signup',
      '/home',
      '/estimate',
      '/analysis',
      '/history',
      '/profile',
      '/history/est-1',
      '/history/risk-1',
    ]) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      await expect(page.locator('body')).not.toContainText('Application error');
      await expect(page.locator('body')).not.toContainText('불러오지 못했습니다');
      await expectNoHorizontalOverflow(page);
      if (width === 390) {
        await page.screenshot({
          path: testInfo.outputPath(`${path.replaceAll('/', '-') || 'landing'}.png`),
          fullPage: true,
        });
      }
    }
  });
}

test('모바일 메뉴는 열기, Escape 닫기, 페이지 이동이 가능하다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/home');
  const menu = page.getByRole('navigation', { name: '주 메뉴' });
  await expect(menu).toBeHidden();
  await page.getByRole('button', { name: '메뉴 열기', exact: true }).click();
  await expect(menu).toBeVisible();
  await menu.getByRole('button', { name: '가견적서 생성' }).focus();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('button', { name: '메뉴 열기', exact: true })).toBeFocused();
  await page.getByRole('button', { name: '메뉴 열기', exact: true }).click();
  await menu.getByRole('button', { name: '내 정보' }).click();
  await expect(page).toHaveURL('/profile');
  await expect(menu).toBeHidden();
  await expect(page.getByRole('heading', { name: '내 정보', exact: true })).toBeVisible();
});

test('320px에서 견적 입력과 공정 선택 후 결과까지 진행한다', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/estimate');
  await page.getByRole('button', { name: '서울', exact: true }).click();
  await page.getByRole('button', { name: '아파트', exact: true }).click();
  await page.getByLabel('전용 면적').fill('25');
  await page.getByRole('button', { name: '3개', exact: true }).click();
  await page.getByRole('button', { name: '다음 단계' }).click();
  await expect(page.getByRole('heading', { name: /Step 2/ })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: '전체 리모델링', exact: true }).click();
  await page.getByRole('button', { name: '다음 단계' }).click();
  await expect(page.getByRole('heading', { name: /Step 3/ })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: '다음 단계' }).click();
  await expect(page.getByText('총 예상 견적 범위 (부가세 별도)', { exact: true })).toBeVisible({ timeout: 30_000 });
  await expectNoHorizontalOverflow(page);
});

test('모바일 이력 표는 표 안에서 스크롤하고 날짜 필터를 열 수 있다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/history');
  const table = page.getByRole('region', { name: '분석 이력 목록' });
  await expect(table).toBeVisible();
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await table.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  expect(await table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await page.locator('button[aria-haspopup="dialog"]').click();
  await expect(page.getByRole('dialog', { name: '날짜 선택' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('모바일 채팅창은 작은 높이에서도 입력과 닫기 버튼이 보인다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/home');
  await page.getByRole('button', { name: 'AI 상담 챗 열기', exact: true }).click();
  const panel = page.locator('#floating-chat-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('input')).toBeInViewport();
  const box = await panel.boundingBox();
  expect(box?.x).toBeGreaterThanOrEqual(0);
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
  expect(box?.y).toBeGreaterThanOrEqual(0);
  await page.getByRole('button', { name: 'AI 상담 챗 닫기', exact: true }).click();
  await expect(panel).toBeHidden();
});
