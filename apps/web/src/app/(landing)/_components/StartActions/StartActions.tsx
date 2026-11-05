'use client';

import { Button } from '@muneo/design-system';
import { PendingLinkLabel } from '@/components/PendingLinkLabel';
import { TransitionLink } from '@/components/TransitionLink';
import { CTA_EVENTS } from '@/constants/analyticsEvents';
import { trackCtaClick } from '@/lib/analytics';
import * as styles from './StartActions.css';

const ACTIONS = [
  { prompt: '받은 견적서가 있어요', label: '무료로 진단하기', path: '/try/analysis', variant: 'gradient' },
  {
    prompt: '아직 견적서가 없어요',
    label: '가견적서 만들기',
    path: '/try/estimate',
    variant: 'outlineSecondaryStrong',
  },
] as const;

export const StartActions = ({ position }: { position: 'hero' | 'bottom' }) => (
  <div className={styles.wrapper}>
    <div className={styles.actions}>
      {ACTIONS.map(({ prompt, label, path, variant }) => {
        const href = path;
        return (
          <div key={path} className={styles.action}>
            <span className={styles.prompt}>{prompt}</span>
            <Button
              as={TransitionLink}
              href={href}
              variant={variant}
              className={styles.button}
              aria-describedby={`${position}-signup-note`}
              onClick={() =>
                trackCtaClick(position === 'hero' ? CTA_EVENTS.landingHeroSignup : CTA_EVENTS.landingBottomSignup, {
                  linkText: label,
                  linkUrl: href,
                  position,
                })
              }
            >
              <PendingLinkLabel>{label}</PendingLinkLabel>
            </Button>
          </div>
        );
      })}
    </div>
    <p id={`${position}-signup-note`} className={styles.note}>
      로그인 없이 먼저 체험하세요. 결과 일부를 확인한 뒤, 전체 내용이 궁금할 때 로그인하면 돼요.
    </p>
  </div>
);
