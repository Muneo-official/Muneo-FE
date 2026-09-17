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

export const container = style({
  maxWidth: '1280px',
  margin: '0 auto',
});

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '24px',
  backgroundColor: 'transparent',
  border: 'none',
  padding: 0,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n500,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  selectors: {
    '&:hover': {
      color: vars.color.neutral.n700,
    },
  },
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const loadingWrap = style({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '80px',
});

export const loadingText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  color: vars.color.neutral.n500,
});
