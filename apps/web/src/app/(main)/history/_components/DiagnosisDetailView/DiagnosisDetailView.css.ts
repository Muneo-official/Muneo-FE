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

export const pdfButton = style({
  '@media': {
    [media.mobile]: { fontSize: '15px', padding: '12px 20px' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: `1.5px solid ${vars.color.neutral.n700}`,
  borderRadius: '8px',
  padding: '9px 40px',
  backgroundColor: vars.color.white,
  fontFamily: vars.typography.fontFamily,
  fontSize: '18px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
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

export const summaryBox = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const summaryTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '20px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const summaryBadges = style({
  '@media': {
    [media.compact]: { flexWrap: 'wrap', gap: '12px' },
  },
  display: 'flex',
  gap: '59px',
  alignItems: 'center',
});

export const summaryBadge = style({
  borderRadius: '8px',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const badgeDanger = style({ backgroundColor: vars.color.semantic.dangerBg, color: vars.color.semantic.danger });
export const badgeWarning = style({
  backgroundColor: vars.color.semantic.warningBg,
  color: vars.color.semantic.warning,
});
export const badgeInfo = style({ backgroundColor: vars.color.semantic.infoBg, color: vars.color.semantic.info });
