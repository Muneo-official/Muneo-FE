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

/* ── 인사이트 카드 ── */
export const insightBox = style({
  '@media': {
    [media.mobile]: { padding: '20px 16px' },
  },
  background: 'linear-gradient(135deg, #F5F0FF 0%, #EEF2FF 100%)',
  border: '1px solid #E3D8FF',
  borderRadius: '16px',
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const insightHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const insightIcon = style({
  fontSize: '18px',
  lineHeight: 1,
});

export const insightTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.semiBold,
  color: '#6D3FD4',
  lineHeight: 'normal',
});

export const insightList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingLeft: '2px',
});

export const insightItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
});

export const insightBullet = style({
  flexShrink: 0,
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#8455DF',
  marginTop: '8px',
});

export const insightText = style({
  '@media': {
    [media.mobile]: { overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.base,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n700,
  lineHeight: '1.7',
  wordBreak: 'keep-all',
});

/* ── 저장 액션 영역 ── */
export const actionRow = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  paddingTop: '4px',
});

export const saveError = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.semantic.danger,
  textAlign: 'right',
});
