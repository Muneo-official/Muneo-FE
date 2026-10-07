import { POLICY_LINKS } from '@/constants/policies';
import * as styles from './PolicyLinks.css';

export const PolicyLinks = () => (
  <div className={styles.container}>
    <nav aria-label="가입 관련 정책" className={styles.links}>
      {POLICY_LINKS.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {link.label} <span className={styles.newTab}>(새 탭)</span>
        </a>
      ))}
    </nav>
    <p className={styles.hint}>현재 검토용 초안이며, 확정 시 적용 내용을 안내합니다.</p>
  </div>
);
