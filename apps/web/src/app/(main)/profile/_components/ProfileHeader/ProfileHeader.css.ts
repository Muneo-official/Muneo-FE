import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

const textBase = {
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  margin: 0,
} as const;

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
});

export const avatar = style({
  ...textBase,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  flexShrink: 0,
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryLight} 100%)`,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.white,
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  minWidth: 0,
});

export const name = style({
  '@media': {
    [media.mobile]: { overflowWrap: 'anywhere' },
  },
  ...textBase,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
});

export const subtitle = style({
  '@media': {
    [media.mobile]: { overflowWrap: 'anywhere' },
  },
  ...textBase,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n400,
});
