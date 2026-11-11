import Link from 'next/link';
import { LockIcon } from '@/components/Locked/Locked';
import * as styles from './TrialUnlockNote.css';

interface TrialUnlockNoteProps {
  title: string;
  signupHref: string;
}

/** 결과 하단 버튼 위의 잠금 안내. 로그인하면 다시 입력·분석하지 않는다는 점을 알려준다. */
export const TrialUnlockNote = ({ title, signupHref }: TrialUnlockNoteProps) => (
  <div className={styles.note}>
    <span className={styles.icon}>
      <LockIcon size={16} />
    </span>
    <div className={styles.body}>
      <strong className={styles.title}>{title}</strong>
      <p className={styles.text}>
        로그인하면 다시 입력하거나 기다리지 않고 지금 결과의 전체 내용을 바로 볼 수 있어요. 결과는 완료 후 30분 동안
        임시 보관돼요.
      </p>
      <Link href={signupHref} className={styles.link}>
        처음이신가요? 무료 회원가입
      </Link>
    </div>
  </div>
);
