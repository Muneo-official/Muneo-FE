import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const FLOATING_OFFSET = '32px';
const FLOATING_SIZE = '52px';
const CHAT_BOTTOM = '96px';
const CHAT_TOP = `max(${FLOATING_OFFSET}, calc(100vh - ${CHAT_BOTTOM} - 680px))`;

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';

const slideUpIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(48px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideDownOut = keyframes({
  '0%': { opacity: 1, transform: 'translateY(0)' },
  '100%': { opacity: 0, transform: 'translateY(48px)' },
});

const iconFadeIn = keyframes({
  '0%': { opacity: 0, transform: 'rotate(-90deg) scale(0.85)' },
  '100%': { opacity: 1, transform: 'rotate(0deg) scale(1)' },
});

export const floatingButton = style({
  position: 'fixed',
  bottom: FLOATING_OFFSET,
  right: FLOATING_OFFSET,
  width: FLOATING_SIZE,
  height: FLOATING_SIZE,
  boxSizing: 'border-box',
  padding: '8px 4px 9px 4px',
  border: 'none',
  borderRadius: '50%',
  backgroundImage: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryLight} 100%)`,
  color: vars.color.white,
  cursor: 'pointer',
  zIndex: 120,
  viewTransitionName: 'floating-chat',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  boxShadow: '0px 4px 16px 0px rgba(109, 63, 197, 0.3)',
  transition: 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease',
  willChange: 'transform',
  overflow: 'hidden',
  selectors: {
    '&:hover': {
      boxShadow: '0px 10px 28px 0px rgba(109, 63, 197, 0.42)',
    },
    '&:active': {
      transform: 'scale(0.92)',
      transitionDuration: '100ms',
      boxShadow: '0px 4px 12px 0px rgba(109, 63, 197, 0.35)',
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.white}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    [media.mobile]: { right: '16px', bottom: 'calc(16px + env(safe-area-inset-bottom))' },

    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const buttonContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  animation: `${iconFadeIn} 220ms ${EASE_OUT} both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const triggerIcon = style({
  width: '44px',
  height: '35px',
});

export const closeLabel = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '8px',
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 1,
  color: vars.color.white,
});

export const chatWrapper = style({
  position: 'fixed',
  top: CHAT_TOP,
  bottom: CHAT_BOTTOM,
  right: FLOATING_OFFSET,
  width: '460px',
  maxWidth: 'calc(100vw - 64px)',
  zIndex: 110,
  transformOrigin: 'bottom right',
  animation: `${slideUpIn} 320ms ${EASE_OUT} both`,
  '@media': {
    [media.mobile]: {
      top: 'auto',
      bottom: 'calc(80px + env(safe-area-inset-bottom))',
      right: '12px',
      width: 'calc(100% - 24px)',
      maxWidth: '460px',
      height: 'min(680px, calc(100dvh - 96px - env(safe-area-inset-top) - env(safe-area-inset-bottom)))',
    },

    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const chatWrapperExit = style({
  animation: `${slideDownOut} 220ms ${EASE_IN_OUT} both`,
  pointerEvents: 'none',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0,
    },
  },
});

export const logoBadge = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const dotBounce = keyframes({
  '0%, 80%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
  '40%': { opacity: 1, transform: 'translateY(-4px)' },
});

export const loadingDots = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  height: '16px',
});

export const loadingDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: vars.color.neutral.n500,
  animation: `${dotBounce} 1.2s infinite ease-in-out both`,
  selectors: {
    '&:nth-child(1)': { animationDelay: '-0.32s' },
    '&:nth-child(2)': { animationDelay: '-0.16s' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      opacity: 0.6,
    },
  },
});

export const loginPromptText = style({
  display: 'block',
  marginBottom: '8px',
});

export const loginLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.white,
  backgroundColor: vars.color.brand.primary,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 200ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0px 4px 12px 0px rgba(109, 63, 197, 0.3)',
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.brand.primary}`,
      outlineOffset: '2px',
    },
  },
});
