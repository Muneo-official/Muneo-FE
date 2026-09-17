import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

const cardBase = style({
  '@media': {
    [media.compact]: { width: '100%', minWidth: 0, height: 'auto', minHeight: '80px', padding: '12px' },
    [media.mobile]: { padding: '12px 8px' },
  },
  position: 'relative',
  width: '160px',
  height: '80px',
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  cursor: 'pointer',
  backgroundColor: vars.color.white,
  transition: 'border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
  flexShrink: 0,
  padding: '11.5px 13.5px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  textAlign: 'left',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  ':active': {
    transform: 'translateY(0)',
    boxShadow: 'none',
  },
});

export const cardSelected = style([cardBase, { border: `1.5px solid ${vars.color.brand.secondary}` }]);
export const cardUnselected = style([cardBase, { border: `1.5px solid ${vars.color.neutral.n300}` }]);

export const processName = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const processNameSelected = style([processName, { color: vars.color.neutral.n900 }]);
export const processNameUnselected = style([processName, { color: vars.color.neutral.n500 }]);

const detailDotBase = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  flexShrink: 0,
});

export const detailDot = style([detailDotBase, { backgroundColor: vars.color.neutral.n300 }]);
export const detailDotActive = style([detailDotBase, { backgroundColor: vars.color.brand.secondary }]);

export const processDesc = style({
  fontSize: vars.typography.fontSize.xxs,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
  whiteSpace: 'pre-line',
});
