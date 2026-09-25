import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { isApiError } from '@/api/errors';
import { getServerMe } from '@/api/user/server';
import { AnalyticsUser } from '@/components/analytics';
import { type AuthUser } from '@/types/auth';
import { SidebarShell } from './_components/SidebarShell';
import { UserProvider } from './_components/UserProvider/UserProvider';
import * as styles from './layout.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const MainLayout = async ({ children }: { children: ReactNode }) => {
  let user: AuthUser;
  try {
    user = await getServerMe();
  } catch (e) {
    if (isApiError(e) && e.status === 401) {
      redirect('/login');
    }
    throw e;
  }

  return (
    <UserProvider user={user}>
      <AnalyticsUser id={user.id} authProvider={user.authProvider} role={user.role} />
      <div className={styles.wrapper}>
        <SidebarShell className={styles.sidebar} user={user} />
        <main className={styles.main}>{children}</main>
      </div>
    </UserProvider>
  );
};

export default MainLayout;
