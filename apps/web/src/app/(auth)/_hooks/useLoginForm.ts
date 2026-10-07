'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { getKakaoLoginUrl } from '@/api/auth';
import { isApiError } from '@/api/errors';
import { login } from '@/api/user';
import { markSocialLoginStart, trackAuth } from '@/lib/analytics';
import { getSafeReturnPath } from '@/lib/authRedirect';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';

export const useLoginForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 홈 화면 렌더가 커밋될 때까지 true로 유지된다. 리다이렉트로 로그인 화면에 되돌아와도 자동으로 풀린다.
  const [isRedirecting, startRedirect] = useTransition();
  const [isKakaoLoading, setIsKakaoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors('root');
    setIsSubmitting(true);
    try {
      await login(data);
    } catch (e) {
      if (isApiError(e) && e.code === 'INVALID_LOGIN_INFO') {
        setError('password', { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      } else {
        setError('root', { message: '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      }
      return;
    } finally {
      setIsSubmitting(false);
    }
    trackAuth('login', 'email');

    // startViewTransition으로 감싸면 홈 렌더를 기다리는 동안 화면이 얼어붙어 진행 상태가 보이지 않는다.
    // 트랜지션으로 이동해 로그인 화면이 진행 상태를 계속 보여주다가, 홈이 준비되면 한 번에 전환되도록 한다.
    startRedirect(() => {
      // 이전 세션에서 받아 둔 (main) 영역 캐시를 비운다. 바로 이어지는 push가 이 refresh 요청을 대체한다.
      router.refresh();
      router.replace(getSafeReturnPath(new URLSearchParams(window.location.search).get('next')));
    });
  });

  const handleKakaoLogin = async () => {
    clearErrors('root');
    setIsKakaoLoading(true);
    try {
      const { loginUrl } = await getKakaoLoginUrl();
      markSocialLoginStart('kakao');
      window.location.href = loginUrl;
    } catch {
      setError('root', { message: '카카오 로그인에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.' });
      setIsKakaoLoading(false);
    }
  };

  return {
    register,
    errors,
    isLoading: isSubmitting || isRedirecting,
    isRedirecting,
    isKakaoLoading,
    onSubmit,
    handleKakaoLogin,
  };
};
