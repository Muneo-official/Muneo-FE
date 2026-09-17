import { style } from '@vanilla-extract/css';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  width: '100%',
});

export const label = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n600,
  lineHeight: 'normal',
  letterSpacing: '-0.112px',
});

export const inputContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: vars.radius.base,
  padding: `${vars.space.md} ${vars.space.lg}`,
  transition: 'border-color 0.15s ease',
  selectors: {
    '&:focus-within': {
      borderColor: vars.color.brand.primary,
    },
  },
});

export const inputContainerError = style({
  borderColor: vars.color.semantic.danger,
  selectors: {
    '&:focus-within': {
      borderColor: vars.color.semantic.danger,
    },
  },
});

export const inputContainerDisabled = style({
  backgroundColor: vars.color.neutral.n100,
  opacity: 0.6,
  cursor: 'not-allowed',
});

export const iconWrapper = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  color: vars.color.neutral.n500,
});

export const input = style({
  '@media': {
    [media.mobile]: { fontSize: '16px' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n900,
  backgroundColor: 'transparent',
  border: 'none',
  outline: 'none',
  width: '100%',
  minWidth: 0,
  selectors: {
    '&::placeholder': {
      color: 'rgba(10, 10, 10, 0.5)',
      fontFamily: vars.typography.fontFamily,
      fontSize: '13px',
      fontWeight: vars.typography.fontWeight.regular,
      lineHeight: 'normal',
    },
    '&:disabled': {
      cursor: 'not-allowed',
    },
  },
});

export const inputRight = style({
  textAlign: 'right',
});

export const suffixText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  color: 'rgba(10, 10, 10, 0.5)',
  flexShrink: 0,
});

export const errorText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.semantic.danger,
  lineHeight: 'normal',
  letterSpacing: '-0.096px',
});
