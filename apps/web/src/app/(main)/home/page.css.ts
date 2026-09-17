import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  '@media': {
    [media.compact]: { padding: '32px 32px 100px' },
    [media.mobile]: { padding: '28px 16px 100px', minHeight: 'calc(100dvh - 64px)' },
  },
  backgroundColor: '#f8f9fc',
  minHeight: '100vh',
  padding: '46px 60px 100px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '1280px',
  margin: '0 auto',
});

export const greetingSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

export const greetingTitle = style({
  fontSize: '24px',
  fontFamily: vars.typography.fontFamilyDisplay,
  fontWeight: vars.typography.fontWeight.bold,
  color: 'rgba(17, 24, 39, 0.85)',
  lineHeight: 'normal',
  margin: 0,
});

export const greetingName = style({
  color: vars.color.brand.primary,
});

export const greetingSubtitle = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n500,
  letterSpacing: '-0.112px',
  opacity: 0.9,
  margin: 0,
});

export const summaryRow = style({
  '@media': {
    [media.compact]: { gap: '12px' },
    [media.mobile]: { flexDirection: 'column' },
  },
  display: 'flex',
  gap: '22px',
  width: '100%',
});
