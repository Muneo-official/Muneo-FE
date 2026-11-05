'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SignupSection } from '@/app/(auth)/_components/SignupSection';
import { useModalBackdrop } from '@/hooks/useModalBackdrop';
import { getCurrentReturnPath, getLoginHref } from '@/lib/authRedirect';
import * as styles from './page.css';

const SignupModalPage = () => {
  const router = useRouter();

  const handleClose = useCallback(() => router.back(), [router]);
  const handleLogin = useCallback(() => router.replace(getLoginHref(getCurrentReturnPath())), [router]);

  const { dialogRef, backdropProps } = useModalBackdrop(handleClose);

  return (
    <div className={styles.backdrop} {...backdropProps}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="회원가입" className={styles.modalWrapper}>
        <SignupSection onLogoClick={handleClose} onClose={handleClose} onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default SignupModalPage;
