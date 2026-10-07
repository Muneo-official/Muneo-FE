import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
});

export const reportHeader = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', gap: '16px' },
  },
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

export const headerLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const reportTitle = style({
  '@media': {
    [media.mobile]: { fontSize: '24px', overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '30px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const reportMeta = style({
  '@media': {
    [media.mobile]: { lineHeight: 1.6, overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n500,
  lineHeight: 'normal',
});

export const summaryCards = style({
  '@media': {
    [media.compact]: { gap: '16px' },
    [media.mobile]: { flexDirection: 'column', gap: '12px' },
  },
  display: 'flex',
  gap: '55px',
  alignItems: 'stretch',
});

export const summaryCard = style({
  flex: '1 0 0',
  alignSelf: 'stretch',
});

export const sections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});
