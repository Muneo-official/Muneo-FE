import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  maxWidth: '880px',
  margin: '0 auto',
});

export const back = style({
  alignSelf: 'flex-start',
  padding: 0,
  background: 'none',
  border: 'none',
  color: vars.color.neutral.n600,
  fontSize: vars.typography.fontSize.sm,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: vars.color.neutral.n900,
    },
  },
});

export const header = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const title = style({
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: vars.typography.fontSize.xl,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  margin: 0,
});

export const grid = style({
  '@media': {
    [media.mobile]: { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.lg,
});

export const fieldRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const readLabel = style({
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n500,
});

export const readValue = style({
  overflowWrap: 'anywhere',
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n900,
  fontWeight: vars.typography.fontWeight.medium,
});

export const errorBox = style({
  padding: vars.space.md,
  backgroundColor: vars.color.semantic.dangerBg,
  color: vars.color.semantic.danger,
  borderRadius: vars.radius.sm,
  fontSize: vars.typography.fontSize.sm,
});

export const loading = style({
  padding: vars.space['3xl'],
  textAlign: 'center',
  color: vars.color.neutral.n500,
});

export const row = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', alignItems: 'flex-start' },
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: vars.space.lg,
  padding: `${vars.space.md} 0`,
});

export const rowLabel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

export const rowLabelTitle = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n900,
});

export const rowLabelDesc = style({
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n500,
});

export const rowControl = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap', width: '100%' },
  },
  display: 'flex',
  gap: vars.space.sm,
  alignItems: 'center',
  flexShrink: 0,
});

export const roleDropdownWrap = style({
  width: 140,
});

export const formActions = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  marginTop: vars.space.md,
});
