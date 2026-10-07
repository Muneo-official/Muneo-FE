import { type Metadata } from 'next';
import { ServiceUnavailable } from '@/components/ServiceUnavailable/ServiceUnavailable';
import * as styles from '@/components/ServiceUnavailable/ServiceUnavailable.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '서비스 연결 안내', robots: { index: false, follow: false } };

export default function MaintenancePage() {
  return (
    <main className={styles.page}>
      <ServiceUnavailable planned={process.env.MAINTENANCE_MODE === 'true'} message={process.env.MAINTENANCE_MESSAGE} />
    </main>
  );
}
