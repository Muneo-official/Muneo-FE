import { vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

export {
  modal,
  closeButton,
  upper,
  logoSection,
  logoButton,
  tagline,
  fullWidth,
  footerRow,
  footerDivider,
} from '../authModal.css';

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '340px',
  maxWidth: '100%',
});

export const formSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: vars.space.sm,
  width: '100%',
});

export const forgotPassword = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.brand.secondary,
  opacity: 0.9,
  letterSpacing: '-0.104px',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.4,
    },
  },
});

export const actionSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '15px',
  width: '100%',
});

export const divider = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xl,
  width: '100%',
  paddingInline: vars.space.md,
});

export const dividerLine = style({
  flex: 1,
  border: 'none',
  borderTop: `1px solid ${vars.color.neutral.n300}`,
  margin: 0,
});

export const dividerText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export const kakaoButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: '#FEE500',
  borderRadius: '12px',
  padding: `${vars.space.md} ${vars.space.lg}`,
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  selectors: {
    '&:hover:not(:disabled)': {
      filter: 'brightness(0.95)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
});

export const kakaoIcon = style({
  position: 'absolute',
  left: vars.space.lg,
});

export const kakaoText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.base,
  fontWeight: vars.typography.fontWeight.bold,
  color: '#000',
});

export const signupText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n600,
  opacity: 0.9,
  letterSpacing: '-0.104px',
  whiteSpace: 'nowrap',
});

export const signupLink = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.brand.secondary,
  opacity: 0.9,
  letterSpacing: '-0.104px',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.4,
      pointerEvents: 'none',
    },
  },
});

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const spinner = style({
  '@media': {
    '(prefers-reduced-motion: reduce)': { animationDuration: '2s' },
  },
  width: '16px',
  height: '16px',
  flexShrink: 0,
  borderRadius: '50%',
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  animation: `${spin} 0.7s linear infinite`,
});
