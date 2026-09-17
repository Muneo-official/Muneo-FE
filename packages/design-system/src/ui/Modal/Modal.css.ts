import { style } from '@vanilla-extract/css';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.lg,
  backgroundColor: 'rgba(17, 24, 39, 0.32)',
});

export const modal = style({
  '@media': {
    [media.mobile]: { padding: '28px 24px', maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' },
  },
  width: 'min(332px, calc(100vw - 32px))',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 60px',
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const inner = style({
  '@media': {
    [media.mobile]: { width: '100%', maxWidth: '212px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '40px',
  width: '212px',
});

export const texts = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  gap: vars.space.sm,
});

export const title = style({
  margin: 0,
  width: '100%',
  color: vars.color.neutral.n500,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.semiBold,
  lineHeight: vars.typography.lineHeight.md,
  textAlign: 'center',
  wordBreak: 'break-word',
});

export const subtitle = style({
  margin: 0,
  width: '100%',
  color: vars.color.black,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  lineHeight: vars.typography.lineHeight.md,
  textAlign: 'center',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.md,
  width: '100%',
});

export const actionButton = style({
  '@media': {
    [media.mobile]: { minWidth: 0, flex: 1 },
  },
  minWidth: '100px',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: '12px',
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 'normal',
  letterSpacing: '-0.112px',
});
