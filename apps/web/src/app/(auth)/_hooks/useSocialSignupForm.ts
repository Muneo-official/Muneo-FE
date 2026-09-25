'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { socialSignup } from '@/api/auth';
import { isApiError } from '@/api/errors';
import { useViewTransitionRouter } from '@/hooks/useViewTransitionRouter';
import { trackAuth } from '@/lib/analytics';
import { applyValidationErrors } from '@/lib/forms/applyValidationErrors';
import { socialSignupSchema, type SocialSignupFormValues } from '@/lib/validations/auth';

const API_FIELD_MAP: Partial<Record<string, keyof SocialSignupFormValues>> = {
  name: 'name',
  phoneNumber: 'phone',
  birthDate: 'birthDate',
};

export const useSocialSignupForm = (ticket: string) => {
  const router = useRouter();
  const { push } = useViewTransitionRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SocialSignupFormValues>({
    resolver: zodResolver(socialSignupSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await socialSignup({
        ticket,
        name: data.name,
        phoneNumber: data.phone,
        birthDate: data.birthDate,
      });
      // 소셜 가입 티켓은 현재 카카오에서만 발급된다.
      trackAuth('sign_up', 'kakao');
      push('/home');
      router.refresh();
    } catch (e) {
      if (isApiError(e) && e.code === 'SOCIAL_SIGNUP_TICKET_EXPIRED') {
        router.replace('/login');
        return;
      }
      if (applyValidationErrors(setError, e, API_FIELD_MAP)) {
        return;
      }
      setError('name', { message: '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  });

  return {
    register,
    setValue,
    errors,
    isLoading,
    onSubmit,
  };
};
