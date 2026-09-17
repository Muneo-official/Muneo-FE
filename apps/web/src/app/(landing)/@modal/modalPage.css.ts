import { media } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideUp = keyframes({
  from: { opacity: 0, transform: 'translateY(12px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  overflowY: 'auto',
  scrollbarWidth: 'none',
  padding: '24px',
  zIndex: 200,
  animation: `${fadeIn} 0.2s ease`,
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  '@media': {
    [media.mobile]: { padding: '16px' },

    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const modalWrapper = style({
  margin: 'auto',
  animation: `${slideUp} 0.25s ease`,
  '@media': {
    [media.mobile]: { width: '100%', maxWidth: '404px' },

    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});
