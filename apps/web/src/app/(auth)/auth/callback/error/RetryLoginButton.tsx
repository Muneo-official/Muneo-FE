'use client';

import { Button } from '@muneo/design-system';
import { useRouter } from 'next/navigation';
import { getLoginHref } from '@/lib/authRedirect';
import { readSocialAuthReturn } from '@/lib/socialAuthReturn';

export const RetryLoginButton = () => {
  const router = useRouter();
  return (
    <Button type="button" variant="primary" onClick={() => router.replace(getLoginHref(readSocialAuthReturn()))}>
      다시 로그인하기
    </Button>
  );
};
