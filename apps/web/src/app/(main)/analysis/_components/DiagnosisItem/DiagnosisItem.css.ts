import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const item = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap', padding: '16px', gap: '12px' },
  },
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
});

export const badge = style({
  borderRadius: '8px',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 'normal',
  whiteSpace: 'normal',
});

export const badgeNormal = style({
  backgroundColor: vars.color.semantic.successBg,
  color: vars.color.semantic.success,
});
export const badgeMissing = style({ backgroundColor: vars.color.semantic.dangerBg, color: vars.color.semantic.danger });
export const badgeInsufficient = style({
  backgroundColor: vars.color.semantic.infoBg,
  color: vars.color.semantic.info,
});
export const badgeUnclear = style({
  backgroundColor: vars.color.semantic.warningBg,
  color: vars.color.semantic.warning,
});

export const texts = style({
  '@media': {
    [media.mobile]: { flex: '1 1 160px' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  flex: '1 0 0',
  minWidth: 0,
});

export const title = style({
  '@media': {
    [media.mobile]: { lineHeight: 1.5, overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const description = style({
  '@media': {
    [media.mobile]: { whiteSpace: 'normal', lineHeight: 1.6, overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '12px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n500,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const actionNote = style({
  '@media': {
    [media.mobile]: { whiteSpace: 'normal', lineHeight: 1.5 },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontFamily: vars.typography.fontFamily,
  fontSize: '12px',
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const actionNoteDanger = style({ color: vars.color.semantic.danger });
export const actionNoteInfo = style({ color: vars.color.semantic.info });
export const actionNoteWarning = style({ color: vars.color.semantic.warning });
