'use client';

import { Button, Logo } from '@muneo/design-system';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { PendingLinkLabel } from '@/components/PendingLinkLabel';
import { TransitionLink } from '@/components/TransitionLink';
import { CTA_EVENTS } from '@/constants/analyticsEvents';
import { TAGLINE } from '@/constants/app';
import { trackCtaClick } from '@/lib/analytics';
import * as styles from './Header.css';

const NAV_ITEMS = [
  { label: '서비스 소개', href: '/#intro' },
  { label: '이용 방법', href: '/#guide' },
  { label: 'FAQ', href: '/#faq' },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={clsx(styles.header, scrolled && styles.headerScrolled)}>
      <div className={styles.inner}>
        <div className={styles.logoSection}>
          <TransitionLink href="/" aria-label="홈으로 이동" className={styles.logoLink} viewTransition>
            <Logo />
          </TransitionLink>
          <span className={styles.tagline}>{TAGLINE}</span>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={styles.navLink}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.authActions}>
          <TransitionLink href="/login" className={styles.loginLink}>
            로그인
          </TransitionLink>
          <Button
            as={TransitionLink}
            href="/try/analysis"
            variant="gradient"
            className={styles.ctaButton}
            onClick={() =>
              trackCtaClick(CTA_EVENTS.landingHeaderSignup, {
                linkText: '무료로 시작하기',
                linkUrl: '/try/analysis',
                position: 'header',
              })
            }
          >
            <PendingLinkLabel>무료로 시작하기</PendingLinkLabel>
          </Button>
        </div>
      </div>
    </header>
  );
};
