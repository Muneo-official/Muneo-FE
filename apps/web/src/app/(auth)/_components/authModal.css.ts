import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const modal = style({
  '@media': {
    [media.mobile]: { width: '100%', maxWidth: '404px', padding: '44px 20px 28px' },
  },
  position: 'relative',
  backgroundColor: vars.color.white,
  borderRadius: '16px',
  padding: `45px ${vars.space['3xl']}`,
});

export const closeButton = style({
  '@media': {
    [media.mobile]: { minWidth: '44px', minHeight: '44px' },
  },
  position: 'absolute',
  top: '4px',
  right: '4px',
  background: 'none',
  border: 'none',
  padding: vars.space.sm,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.neutral.n400,
});

export const upper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '27px',
  width: '100%',
});

export const logoSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
});

export const logoButton = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
});

export const tagline = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: '#8a7da5',
  letterSpacing: '-0.096px',
  textAlign: 'center',
});

export const fullWidth = style({
  width: '100%',
});

export const footerRow = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap', justifyContent: 'center', gap: '8px' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '13px',
});

export const footerDivider = style({
  width: '1px',
  height: '14px',
  backgroundColor: vars.color.neutral.n300,
  flexShrink: 0,
});
