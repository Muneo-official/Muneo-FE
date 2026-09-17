import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  '@media': {
    [media.compact]: { width: '100%', maxWidth: '700px', justifyContent: 'center', gap: '8px' },
    [media.mobile]: { gap: '4px' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export const stepItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
});

export const stepItemWide = style([
  stepItem,
  {
    width: '57px',
  },
]);

export const circle = style({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const circlePending = style([
  circle,
  {
    backgroundColor: vars.color.white,
    border: `1.5px solid ${vars.color.neutral.n300}`,
  },
]);

export const circleActive = style([
  circle,
  {
    backgroundColor: '#8455DF',
    border: 'none',
  },
]);

export const circleCompleted = style([
  circle,
  {
    backgroundColor: 'transparent',
  },
]);

export const stepNumber = style({
  fontSize: vars.typography.fontSize.xxs,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  textAlign: 'center',
});

export const stepNumberPending = style([stepNumber, { color: vars.color.neutral.n400 }]);
export const stepNumberActive = style([stepNumber, { color: vars.color.white }]);

export const stepLabel = style({
  '@media': {
    [media.mobile]: { fontSize: '10px', whiteSpace: 'normal' },
  },
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export const stepLabelPending = style([stepLabel, { color: vars.color.neutral.n400 }]);
export const stepLabelActive = style([stepLabel, { color: '#4E23A9' }]);
export const stepLabelCompleted = style([stepLabel, { color: vars.color.semantic.success }]);

export const connector = style({
  '@media': {
    [media.compact]: { width: 'auto', flex: 1, minWidth: '8px', flexShrink: 1 },
  },
  width: '120px',
  height: '2px',
  flexShrink: 0,
  alignSelf: 'flex-start',
  marginTop: '13px',
});

export const connectorGreen = style([connector, { backgroundColor: vars.color.semantic.success }]);

export const iconCompleted = style({ color: vars.color.semantic.success, flexShrink: 0 });
export const connectorGray = style([connector, { backgroundColor: vars.color.neutral.n300 }]);
