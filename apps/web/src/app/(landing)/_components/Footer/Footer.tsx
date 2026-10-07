import { Logo } from '@muneo/design-system';
import { CONTACT_EMAIL, COPYRIGHT, OPERATOR_NAME, TAGLINE } from '@/constants/app';
import { POLICY_LINKS } from '@/constants/policies';
import * as styles from './Footer.css';

const LINK_GROUPS = [
  {
    title: '서비스',
    items: [
      { label: '서비스 소개', href: '/#intro' },
      { label: '가이드라인', href: '/#guide' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: '정보',
    items: POLICY_LINKS,
  },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <Logo />
              <span className={styles.tagline}>{TAGLINE}</span>
            </div>
            <p className={styles.description}>
              AI 기반 인테리어 견적 분석 서비스
              <br />
              합리적인 시공을 위한 첫 걸음
            </p>
            <address className={styles.operator}>
              <span>개인 운영 · {OPERATOR_NAME}</span>
              <a href={`mailto:${CONTACT_EMAIL}`}>문의 {CONTACT_EMAIL}</a>
            </address>
          </div>
          <ul className={styles.links}>
            {LINK_GROUPS.map(({ title, items }) => (
              <li key={title} className={styles.linkGroup}>
                <h3 className={styles.linkGroupTitle}>{title}</h3>
                <ul className={styles.linkGroupItems}>
                  {items.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className={styles.linkItem}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <hr className={styles.divider} />
        <div className={styles.bottom}>
          <p className={styles.copyright}>{COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
};
