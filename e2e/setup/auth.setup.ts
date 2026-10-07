import { test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const AUTH_STATE_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ browser }) => {
  mkdirSync(dirname(AUTH_STATE_FILE), { recursive: true });

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'access_token',
      value: 'mock-access',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
    {
      name: 'refresh_token',
      value: 'mock-refresh',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);

  await context.storageState({ path: AUTH_STATE_FILE });
  await context.close();
});
