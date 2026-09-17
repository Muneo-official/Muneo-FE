'use client';

import { Button, CloseRoundFill, KakaoIcon, TextField } from '@muneo/design-system';
import { useId } from 'react';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { type LoginFormValues } from '@/lib/validations/auth';
import { AuthModalHeader } from '../AuthModalHeader';
import * as styles from './LoginModal.css';

export interface LoginModalProps {
  className?: string;
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isLoading?: boolean;
  isRedirecting?: boolean;
  isKakaoLoading?: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onKakaoLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  onLogoClick?: () => void;
  onClose?: () => void;
}

export const LoginModal = ({
  className,
  register,
  errors,
  isLoading,
  isRedirecting,
  isKakaoLoading,
  onSubmit,
  onKakaoLogin,
  onForgotPassword,
  onSignUp,
  onLogoClick,
  onClose,
}: LoginModalProps) => {
  const emailId = useId();
  const passwordId = useId();
  const isBusy = Boolean(isLoading || isKakaoLoading);

  return (
    <div className={[styles.modal, className].filter(Boolean).join(' ')}>
      {onClose && (
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
          <CloseRoundFill />
        </button>
      )}
      {/* JS 로드 전에 제출돼도 자격 증명이 GET 쿼리스트링(URL·방문 기록·분석 이벤트)에 남지 않도록 POST로 둔다. */}
      <form className={styles.inner} method="post" onSubmit={onSubmit} noValidate>
        <div className={styles.upper}>
          <AuthModalHeader onLogoClick={onLogoClick} />

          <div className={styles.formSection}>
            <TextField
              id={emailId}
              label="이메일"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              id={passwordId}
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button type="button" className={styles.forgotPassword} onClick={onForgotPassword} disabled={isBusy}>
              비밀번호 찾기
            </button>
          </div>
        </div>

        <div className={styles.actionSection}>
          <Button
            type="submit"
            variant="primary"
            className={styles.fullWidth}
            disabled={isBusy}
            aria-busy={Boolean(isLoading)}
          >
            {isLoading && <span className={styles.spinner} aria-hidden />}
            {isRedirecting ? '홈으로 이동 중...' : isLoading ? '로그인 중...' : '로그인'}
          </Button>

          <div className={styles.divider}>
            <hr className={styles.dividerLine} />
            <span className={styles.dividerText}>또는</span>
            <hr className={styles.dividerLine} />
          </div>

          <button type="button" className={styles.kakaoButton} onClick={onKakaoLogin} disabled={isBusy}>
            <KakaoIcon className={styles.kakaoIcon} />
            <span className={styles.kakaoText}>{isKakaoLoading ? '이동 중...' : '카카오 로그인'}</span>
          </button>

          <div className={styles.footerRow}>
            <span className={styles.signupText}>계정이 없으신가요?</span>
            <div className={styles.footerDivider} />
            {onSignUp ? (
              <button type="button" className={styles.signupLink} onClick={onSignUp} disabled={isBusy}>
                회원가입
              </button>
            ) : (
              <a
                href="/signup"
                className={styles.signupLink}
                aria-disabled={isBusy}
                tabIndex={isBusy ? -1 : undefined}
                onClick={(e) => {
                  if (isBusy) {
                    e.preventDefault();
                  }
                }}
              >
                회원가입
              </a>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
