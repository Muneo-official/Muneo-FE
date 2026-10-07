'use client';

import { Button, Logo2 } from '@muneo/design-system';
import { useState } from 'react';
import { getSafeReturnPath } from '@/lib/authRedirect';
import * as styles from './ServiceUnavailable.css';

interface ServiceUnavailableProps {
  planned?: boolean;
  message?: string;
  onRecovered?: () => void;
  onDismiss?: () => void;
}

export const ServiceUnavailable = ({ planned = false, message, onRecovered, onDismiss }: ServiceUnavailableProps) => {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState('');

  const checkConnection = async () => {
    setChecking(true);
    setStatus('');
    try {
      const response = await fetch('/api/service-status', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
      if (!response.ok) {
        setStatus('아직 연결이 원활하지 않아요. 잠시 후 다시 확인해 주세요.');
        return;
      }
      if (onRecovered) {
        onRecovered();
      } else {
        const next = new URLSearchParams(window.location.search).get('next');
        window.location.replace(getSafeReturnPath(next));
      }
    } catch {
      setStatus('연결을 확인하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className={styles.panel}>
      <Logo2 width={64} height={64} aria-hidden="true" />
      <span className={styles.badge}>{planned ? '서비스 점검 안내' : '일시적인 연결 장애'}</span>
      <h1 id="service-unavailable-title" className={styles.title}>
        {planned ? '더 안정적인 문어를 위해 점검 중이에요' : '문어에 잠시 연결할 수 없어요'}
      </h1>
      <p className={styles.description}>
        {message || '지금은 요청을 처리하기 어려워요. 잠시 후 다시 확인해 주세요.'}
        {onDismiss && (
          <>
            <br />
            입력한 내용은 이 화면에 유지돼요. 연결이 복구되면 다시 시도할 수 있어요.
          </>
        )}
      </p>
      <div className={styles.actions}>
        <Button onClick={checkConnection} disabled={checking} aria-busy={checking}>
          {checking ? '연결 확인 중...' : '연결 다시 확인'}
        </Button>
        {onDismiss ? (
          <Button variant="outlineSecondary" onClick={onDismiss}>
            입력 화면으로 돌아가기
          </Button>
        ) : (
          <Button as="a" href="/" variant="outlineSecondary">
            서비스 소개 보기
          </Button>
        )}
      </div>
      <p role="status" className={styles.description}>
        {status}
      </p>
    </div>
  );
};
