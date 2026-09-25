'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup } from '@/api/user';
import { useViewTransitionRouter } from '@/hooks/useViewTransitionRouter';
import { trackAuth } from '@/lib/analytics';
import { applyValidationErrors } from '@/lib/forms/applyValidationErrors';
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth';

const FIELD_MAP: Partial<Record<string, keyof SignupFormValues>> = {
  phoneNumber: 'phone',
  email: 'email',
  password: 'password',
  passwordConfirm: 'passwordConfirm',
  name: 'name',
  birthDate: 'birthDate',
};

export const useSignupForm = () => {
  const router = useRouter();
  const { push } = useViewTransitionRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await signup({
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        name: data.name,
        phoneNumber: data.phone,
        birthDate: data.birthDate,
      });
      trackAuth('sign_up', 'email');
      push('/home');
      router.refresh();
    } catch (e) {
      if (!applyValidationErrors(setError, e, FIELD_MAP, 'email')) {
        setError('email', { message: '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
      }
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
