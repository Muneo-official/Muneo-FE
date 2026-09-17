import { style } from '@vanilla-extract/css';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const wrapper = style({
  '@media': { [media.mobile]: { height: '52px', padding: '4px 6px 4px 16px' } },
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '40px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '20px',
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: vars.space['2xl'],
  paddingRight: vars.space.sm,
  gap: vars.space.sm,
  selectors: {
    '&:focus-within': {
      borderColor: vars.color.brand.primary,
    },
  },
});

export const input = style({
  '@media': { [media.mobile]: { fontSize: '16px' } },
  flex: 1,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n900,
  minWidth: 0,
  selectors: {
    '&::placeholder': {
      color: vars.color.neutral.n400,
    },
  },
});

export const sendButton = style({
  '@media': { [media.mobile]: { width: '44px', height: '44px' } },
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: 'none',
  padding: '2px',
  backgroundImage: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryLight} 100%)`,
  cursor: 'pointer',
  transition: 'opacity 0.15s ease',
  selectors: {
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});
