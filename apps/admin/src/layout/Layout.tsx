import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import * as styles from './Layout.css';

export const Layout = () => (
  <div className={styles.shell}>
    <Sidebar />
    <main className={styles.main}>
      {import.meta.env.DEV && import.meta.env.MODE === 'qa' && (
        <p className={styles.qaNotice} role="status">
          로컬 QA · 가상 데이터입니다. 실제 사용자 정보와 연결되지 않습니다.
        </p>
      )}
      <Outlet />
    </main>
  </div>
);
