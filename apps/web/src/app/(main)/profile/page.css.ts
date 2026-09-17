import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  '@media': {
    [media.compact]: { padding: '32px 32px 100px' },
    [media.mobile]: { padding: '28px 16px 100px', minHeight: 'calc(100dvh - 64px)' },
  },
  backgroundColor: vars.color.neutral.nSurface,
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

export const title = style({
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: vars.typography.fontSize.xl,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  margin: 0,
  lineHeight: 'normal',
});
