import { media, vars } from '@muneo/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const card = style({
  padding: vars.space.lg,
  backgroundColor: vars.color.white,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.neutral.n200}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

export const row = style({
  '@media': {
    [media.mobile]: { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: vars.space.md,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

globalStyle(`${field} input`, { fontSize: '13px' });
globalStyle(`${field} button`, { fontSize: '13px' });

export const label = style({
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n600,
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
});
