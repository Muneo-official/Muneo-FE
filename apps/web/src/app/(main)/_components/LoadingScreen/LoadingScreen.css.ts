import { vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const float = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-12px)' },
});

const shadowPulse = keyframes({
  '0%, 100%': { transform: 'scaleX(1)', opacity: 0.18 },
  '50%': { transform: 'scaleX(0.72)', opacity: 0.08 },
});

const workingBounce = keyframes({
  '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.35 },
  '40%': { transform: 'translateY(-6px)', opacity: 1 },
});

const msgIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const msgOut = keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(-6px)' },
});

const shimmer = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(400%)' },
});

const cardIn = keyframes({
  from: { opacity: 0, transform: 'translateX(24px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});

const cardOut = keyframes({
  from: { opacity: 1, transform: 'translateX(0)' },
  to: { opacity: 0, transform: 'translateX(-24px)' },
});

const MOTION = '(prefers-reduced-motion: reduce)' as const;

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  padding: '200px 24px 40px',
});

export const mascotWrap = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '8px',
});

export const mascotFloating = style({
  animation: `${float} 2.6s ease-in-out infinite`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const mascotImg = style({
  width: '92px',
  height: 'auto',
  display: 'block',
});

export const mascotShadow = style({
  width: '56px',
  height: '8px',
  borderRadius: '50%',
  background: 'rgba(132, 85, 223, 0.22)',
  filter: 'blur(4px)',
  marginTop: '2px',
  animation: `${shadowPulse} 2.6s ease-in-out infinite`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const workingDots = style({
  display: 'flex',
  gap: '6px',
  justifyContent: 'center',
  marginTop: '12px',
  marginBottom: '20px',
});

export const workingDot = style({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  backgroundColor: vars.color.brand.primary,
  opacity: 0.35,
  animation: `${workingBounce} 1.4s ease-in-out infinite`,
  '@media': { [MOTION]: { animation: 'none', opacity: 1 } },
});

export const msgWrap = style({
  height: '22px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '14px',
});

export const msg = style({
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
  textAlign: 'center',
  fontWeight: vars.typography.fontWeight.medium,
  animation: `${msgIn} 0.35s ease-out both`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const msgExiting = style({
  animation: `${msgOut} 0.25s ease-in both`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const progressWrap = style({
  width: '100%',
  maxWidth: '320px',
  height: '5px',
  borderRadius: '10px',
  backgroundColor: vars.color.neutral.n200,
  overflow: 'hidden',
  marginBottom: '32px',
  position: 'relative',
});

export const progressFill = style({
  height: '100%',
  borderRadius: '10px',
  background: 'linear-gradient(90deg, #7B5CE5 0%, #B199FF 100%)',
  width: '0%',
  willChange: 'width',
  position: 'relative',
  overflow: 'hidden',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '25%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
      animation: `${shimmer} 2.2s ease-in-out infinite`,
    },
  },
  '@media': {
    [MOTION]: {
      selectors: {
        '&::after': { animation: 'none' },
      },
    },
  },
});

export const tipCard = style({
  width: '100%',
  maxWidth: '480px',
  boxSizing: 'border-box',
  backgroundColor: '#F5F0FF',
  border: '1px solid #E3D8FF',
  borderRadius: '16px',
  padding: '20px 24px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
  animation: `${cardIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const tipCardExiting = style({
  animation: `${cardOut} 0.28s ease-in both`,
  '@media': { [MOTION]: { animation: 'none' } },
});

export const tipHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const tipLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  color: '#7B5CE5',
  letterSpacing: '0.02em',
});

export const tipCounter = style({
  fontSize: vars.typography.fontSize.xs,
  color: '#B199FF',
  fontWeight: vars.typography.fontWeight.medium,
  fontVariantNumeric: 'tabular-nums',
});

export const tipText = style({
  fontSize: vars.typography.fontSize.base,
  color: vars.color.neutral.n700,
  lineHeight: '1.75',
  fontWeight: vars.typography.fontWeight.regular,
  wordBreak: 'keep-all',
});

export const tipProgressTrack = style({
  width: '100%',
  height: '3px',
  borderRadius: '10px',
  backgroundColor: '#E3D8FF',
  overflow: 'hidden',
  marginTop: '4px',
});

export const tipProgressFill = style({
  height: '100%',
  borderRadius: '10px',
  background: 'linear-gradient(90deg, #8455DF, #B199FF)',
  transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

export const footerText = style({
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n400,
});

export const cancelBtn = style({
  background: 'none',
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: vars.radius.sm,
  padding: '8px 20px',
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
  cursor: 'pointer',
  fontFamily: vars.typography.fontFamily,
  transition: 'opacity 0.15s ease',
  selectors: {
    '&:hover': { opacity: 0.65 },
  },
});
