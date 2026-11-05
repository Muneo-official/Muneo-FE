import { Button, TriangleWarningIcon } from '@muneo/design-system';
import { RetryLoginButton } from './RetryLoginButton';
import * as styles from './page.css';

const REASON_MESSAGES: Record<string, string> = {
  SOCIAL_LOGIN_FAILED: '카카오 로그인에 실패했습니다.',
  ACCOUNT_LOCKED: '계정이 잠겨 있습니다. 고객센터에 문의해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};
const DEFAULT_MESSAGE = '카카오 로그인 중 오류가 발생했습니다.';

interface SocialLoginErrorPageProps {
  searchParams: Promise<{ reason?: string }>;
}

const SocialLoginErrorPage = async ({ searchParams }: SocialLoginErrorPageProps) => {
  const { reason } = await searchParams;
  const message = (reason && REASON_MESSAGES[reason]) ?? DEFAULT_MESSAGE;

  return (
    <div className={styles.wrapper}>
      <TriangleWarningIcon width={48} height={48} className={styles.icon} />
      <h2 className={styles.title}>오류가 발생했습니다</h2>
      <p className={styles.description}>{message}</p>
      <div className={styles.actions}>
        <RetryLoginButton />
        <Button as="a" variant="outlineSecondaryStrong" href="/">
          홈으로
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginErrorPage;
