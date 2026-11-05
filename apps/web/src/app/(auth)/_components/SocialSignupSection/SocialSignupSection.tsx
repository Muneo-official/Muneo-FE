'use client';

import { useRouter } from 'next/navigation';
import { getLoginHref } from '@/lib/authRedirect';
import { readSocialAuthReturn } from '@/lib/socialAuthReturn';
import { useSocialSignupForm } from '../../_hooks/useSocialSignupForm';
import { SocialSignupModal } from '../SocialSignupModal';

interface SocialSignupSectionProps {
  ticket: string;
}

export const SocialSignupSection = ({ ticket }: SocialSignupSectionProps) => {
  const router = useRouter();
  const { register, setValue, errors, isLoading, onSubmit } = useSocialSignupForm(ticket);

  const handleClose = () => router.push('/');
  const handleLogin = () => router.replace(getLoginHref(readSocialAuthReturn()));

  return (
    <SocialSignupModal
      register={register}
      setValue={setValue}
      errors={errors}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onClose={handleClose}
      onLogoClick={handleClose}
      onLogin={handleLogin}
    />
  );
};
