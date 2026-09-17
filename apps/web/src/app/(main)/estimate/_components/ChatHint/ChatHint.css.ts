import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const SPRING_OUT = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 0.2, 1)';

const popIn = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9) translateY(-4px)' },
  '70%': { opacity: 1, transform: 'scale(1.02) translateY(0)' },
  '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
});

const popOut = keyframes({
  '0%': { opacity: 1, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(0.92) translateY(-3px)' },
});

export const wrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  marginTop: '8px',
  padding: '5px 12px',
  borderRadius: '999px',
  backgroundColor: vars.color.neutral.n100,
  width: 'fit-content',
  animation: `${popIn} 300ms ${SPRING_OUT} both`,
  '@media': {
    [media.mobile]: { maxWidth: '100%', flexWrap: 'wrap' },

    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const wrapExit = style({
  animation: `${popOut} 180ms ${EASE_IN} both`,
  pointerEvents: 'none',
});

export const text = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
});

export const btn = style({
  '@media': {
    [media.mobile]: { minHeight: '44px' },
  },
  flexShrink: 0,
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n700,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  transition: 'opacity 0.15s ease',
  selectors: {
    '&:hover': { opacity: 0.6 },
  },
});
