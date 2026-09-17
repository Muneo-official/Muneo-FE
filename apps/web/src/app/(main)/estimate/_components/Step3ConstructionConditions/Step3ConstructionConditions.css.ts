import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
});

export const header = style({
  '@media': {
    [media.compact]: { flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'normal' },
  },
  display: 'flex',
  alignItems: 'flex-end',
  gap: '13px',
  flexShrink: 0,
});

export const title = style({
  '@media': {
    [media.mobile]: { fontSize: '20px', lineHeight: 1.5 },
  },
  fontSize: vars.typography.fontSize.xl,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
  margin: 0,
});

export const titleAccent = style({
  color: vars.color.brand.secondary,
});

export const titleHint = style({
  '@media': {
    [media.compact]: { whiteSpace: 'normal', lineHeight: 1.5 },
  },
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.medium,
  fontFamily: vars.typography.fontFamily,
  color: 'rgba(79, 37, 162, 0.75)',
  letterSpacing: '-0.12px',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const card = style({
  '@media': {
    [media.mobile]: { padding: '24px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  boxShadow: '0px 2px 2px 0px rgba(0,0,0,0.11)',
  padding: '20px 40px 28px',
  width: '100%',
});

export const fields = style({
  '@media': {
    [media.mobile]: { gap: '32px' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '95px',
});

export const fieldRows = style({
  '@media': {
    [media.mobile]: { gap: '28px' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '45px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const fieldHeader = style({
  '@media': {
    [media.mobile]: { height: 'auto', flexWrap: 'wrap', whiteSpace: 'normal', gap: '6px' },
  },
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  height: '20px',
  whiteSpace: 'nowrap',
});

export const fieldLabel = style({
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const fieldHint = style({
  fontSize: vars.typography.fontSize.xxs,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
});

export const buttonRow = style({
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const twoColRow = style({
  '@media': {
    [media.compact]: { gridTemplateColumns: '1fr', gap: '28px' },
  },
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
});

export const twoColLeft = style({
  '@media': {
    [media.mobile]: { gap: '20px', flexWrap: 'wrap' },
  },
  display: 'flex',
  gap: '52px',
  alignItems: 'center',
});

export const twoColRight = style({
  '@media': {
    [media.mobile]: { gridTemplateColumns: '1fr', gap: '28px' },
  },
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  alignItems: 'center',
});

export const floorField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '90px',
});

export const areaInput = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '4px',
  minWidth: '80px',
  padding: `${vars.space.md} ${vars.space.lg}`,
  border: `1.5px solid ${vars.color.neutral.n200}`,
  borderRadius: vars.radius.base,
  backgroundColor: vars.color.white,
  overflow: 'hidden',
  alignSelf: 'flex-start',
});

export const areaInputNumber = style({
  '@media': {
    [media.mobile]: { fontSize: '16px' },
  },
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: 'rgba(10, 10, 10, 0.5)',
  lineHeight: 'normal',
  border: 'none',
  outline: 'none',
  textAlign: 'right',
  width: '28px',
  backgroundColor: 'transparent',
});

export const areaUnit = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: 'rgba(10, 10, 10, 0.5)',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

export const actions = style({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  height: '45px',
});
