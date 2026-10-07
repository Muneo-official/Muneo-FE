'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { SERVICE_UNAVAILABLE_EVENT } from '@/lib/serviceAvailability';
import { ServiceUnavailable } from './ServiceUnavailable';
import * as styles from './ServiceUnavailable.css';

export const ServiceAvailabilityProvider = ({ children }: { children: ReactNode }) => {
  const [unavailable, setUnavailable] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(unavailable);
  useFocusTrap(dialogRef, unavailable);

  useEffect(() => {
    const show = () => setUnavailable(true);
    window.addEventListener(SERVICE_UNAVAILABLE_EVENT, show);
    return () => window.removeEventListener(SERVICE_UNAVAILABLE_EVENT, show);
  }, []);

  return (
    <>
      <div inert={unavailable || undefined}>{children}</div>
      {unavailable && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-unavailable-title"
          className={styles.overlay}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setUnavailable(false);
            }
          }}
        >
          <ServiceUnavailable onDismiss={() => setUnavailable(false)} onRecovered={() => setUnavailable(false)} />
        </div>
      )}
    </>
  );
};
