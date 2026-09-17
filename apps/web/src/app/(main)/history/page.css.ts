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

export const title = style({
  fontSize: '24px',
  fontFamily: vars.typography.fontFamilyDisplay,
  fontWeight: vars.typography.fontWeight.bold,
  color: '#111827',
  lineHeight: 'normal',
  margin: 0,
});
