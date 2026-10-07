'use client';

import { useLoginForm } from '../../_hooks/useLoginForm';
import { LoginModal } from '../LoginModal';

interface LoginSectionProps {
  onLogoClick?: () => void;
  onClose?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

export const LoginSection = ({ onLogoClick, onClose, onForgotPassword, onSignUp }: LoginSectionProps) => {
  const { register, errors, isLoading, isRedirecting, isKakaoLoading, onSubmit, handleKakaoLogin } = useLoginForm();

  return (
    <LoginModal
      register={register}
      errors={errors}
      isLoading={isLoading}
      isRedirecting={isRedirecting}
      isKakaoLoading={isKakaoLoading}
      onSubmit={onSubmit}
      onLogoClick={onLogoClick}
      onClose={onClose}
      onKakaoLogin={handleKakaoLogin}
      onForgotPassword={onForgotPassword}
      onSignUp={onSignUp}
    />
  );
};
