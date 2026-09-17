import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [media.compact]: { minWidth: 0 },
    [media.mobile]: { padding: '24px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  padding: '28px 30px',
  display: 'flex',
  flexDirection: 'column',
  gap: '19px',
  flex: '1 0 0',
  alignSelf: 'stretch',
});

export const cardTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const fieldRow = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', gap: '24px' },
  },
  display: 'flex',
  gap: '30px',
  alignItems: 'flex-start',
});

export const fieldGroup = style({
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: '1 0 0',
  minWidth: 0,
});

export const fieldGroupFixed = style({
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '185px',
  flexShrink: 0,
});

export const label = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n600,
  lineHeight: 'normal',
  letterSpacing: '-0.112px',
});
