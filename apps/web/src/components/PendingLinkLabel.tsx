'use client';

import { useLinkStatus } from 'next/link';
import { type ReactNode } from 'react';

export const PendingLinkLabel = ({ children }: { children: ReactNode }) => {
  const { pending } = useLinkStatus();
  return (
    <span aria-live="polite" aria-busy={pending}>
      {pending ? '화면 여는 중…' : children}
    </span>
  );
};
