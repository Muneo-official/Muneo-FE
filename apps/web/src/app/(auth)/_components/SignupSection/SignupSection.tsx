'use client';

import { useRouter } from 'next/navigation';
import { getCurrentReturnPath, getLoginHref } from '@/lib/authRedirect';
import { useSignupForm } from '../../_hooks/useSignupForm';
import { SignupModal } from '../SignupModal';

interface SignupSectionProps {
  onLogoClick?: () => void;
  onClose?: () => void;
  onLogin?: () => void;
}

export const SignupSection = ({ onLogoClick, onClose, onLogin }: SignupSectionProps) => {
  const router = useRouter();
  const { register, setValue, errors, isLoading, onSubmit } = useSignupForm();

  return (
    <SignupModal
      register={register}
      setValue={setValue}
      errors={errors}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onLogin={onLogin ?? (() => router.push(getLoginHref(getCurrentReturnPath())))}
      onLogoClick={onLogoClick}
      onClose={onClose}
    />
  );
};
