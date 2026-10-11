import { expect, test } from '@playwright/test';

/**
 * 시각 회귀 테스트.
 * 기준 이미지는 `visual.spec.ts-snapshots/`에 저장하고 커밋합니다.
 * CI는 Linux 기준 이미지를 사용하므로 macOS에서 생성한 이미지로 대체하지 않습니다.
 *
 * 의도한 화면 변경은 CI의 actual/diff 이미지를 검토한 뒤 기준에 반영합니다.
 * 같은 Linux 환경에서 재생성: `pnpm test:e2e:update e2e/visual.spec.ts`
 * 갱신 절차와 검증 기록: 루트 `README.md`의 검사·배포 항목
 */

test.describe('Visual regression', () => {
  // 디자인 기준 1440 데스크탑 viewport로 통일
  test.use({ viewport: { width: 1440, height: 900 } });

  test('랜딩 페이지 Hero 영역', async ({ page }) => {
    await page.goto('/');
    // 폰트 로드 + 애니메이션 진정 대기
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const hero = page.getByTestId('hero-section');
    await expect(hero).toHaveScreenshot('landing-hero.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });

  test('랜딩 페이지 풀 페이지', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await expect(page).toHaveScreenshot('landing-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });
});
