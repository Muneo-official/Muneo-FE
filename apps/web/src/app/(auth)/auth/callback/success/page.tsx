'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { consumeSocialAuthReturn } from '@/lib/socialAuthReturn';

const SocialLoginSuccessPage = () => {
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) {
      return;
    }
    redirected.current = true;
    router.replace(consumeSocialAuthReturn());
  }, [router]);

  return <p role="status">로그인한 계정으로 이동하고 있어요.</p>;
};

export default SocialLoginSuccessPage;
