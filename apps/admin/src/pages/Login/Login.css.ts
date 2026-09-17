import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.color.neutral.nSurface,
  padding: vars.space.lg,
});

export const card = style({
  '@media': {
    [media.mobile]: { padding: '24px' },
  },
  width: '100%',
  maxWidth: '420px',
  padding: vars.space['3xl'],
  backgroundColor: vars.color.white,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.neutral.n200}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
});

export const title = style({
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: vars.typography.fontSize.xl,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  margin: 0,
});

export const subtitle = style({
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
  margin: 0,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

export const errorBox = style({
  padding: vars.space.md,
  backgroundColor: vars.color.semantic.dangerBg,
  color: vars.color.semantic.danger,
  borderRadius: vars.radius.sm,
  fontSize: vars.typography.fontSize.sm,
});
