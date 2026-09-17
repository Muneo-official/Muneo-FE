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
  width: '100%',
  maxWidth: '1280px',
  margin: '0 auto',
});

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const pageTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '30px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const pageSubtitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n500,
  lineHeight: 'normal',
});

export const loadingState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  minHeight: '400px',
});

export const loadingText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  color: vars.color.neutral.n500,
});

export const errorText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  color: vars.color.semantic.danger,
});

export const retryButton = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n700,
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: '8px',
  padding: '8px 20px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.neutral.n100,
  },
});

export const inputLayout = style({
  display: 'flex',
  gap: '17px',
  alignItems: 'stretch',
  '@media': { [media.compact]: { flexDirection: 'column' } },
});
