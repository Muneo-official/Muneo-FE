import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  backgroundColor: vars.color.white,
  borderRadius: vars.radius.sm,
  border: `1px solid ${vars.color.neutral.n200}`,
  overflow: 'hidden',
});

export const table = style({
  '@media': {
    [media.mobile]: { minWidth: '800px' },
  },
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: vars.typography.fontSize.sm,
});

export const th = style({
  textAlign: 'left',
  padding: `${vars.space.md} ${vars.space.lg}`,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  color: vars.color.neutral.n600,
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
  backgroundColor: vars.color.neutral.nSurface,
  whiteSpace: 'nowrap',
});

export const tr = style({
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.neutral.nSurface,
    },
    '&:not(:last-child)': {
      borderBottom: `1px solid ${vars.color.neutral.n100}`,
    },
  },
});

export const td = style({
  padding: `${vars.space.md} ${vars.space.lg}`,
  color: vars.color.neutral.n900,
  whiteSpace: 'nowrap',
});

export const empty = style({
  padding: vars.space['3xl'],
  textAlign: 'center',
  color: vars.color.neutral.n500,
});

export const pagination = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap', gap: '12px' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderTop: `1px solid ${vars.color.neutral.n200}`,
});

export const pageInfo = style({
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n600,
});

export const pageButtons = style({
  display: 'flex',
  gap: vars.space.sm,
});

export const pageBtn = style({
  '@media': {
    [media.mobile]: { minHeight: '44px' },
  },
  padding: `${vars.space.xs} ${vars.space.md}`,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n700,
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: vars.color.neutral.n100,
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const tableScroll = style({
  width: '100%',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
});
