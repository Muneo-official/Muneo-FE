import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const value = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  whiteSpace: 'nowrap',
});

export const blurred = style({
  filter: 'blur(6px)',
  userSelect: 'none',
  pointerEvents: 'none',
});

export const icon = style({
  flexShrink: 0,
  color: 'currentColor',
  opacity: 0.8,
});

/** 흐린 가짜 행 위에 "로그인하고 보기" 버튼을 겹쳐 올리는 영역. */
export const area = style({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
});

export const overlay = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.55))',
});

export const unlockLink = style({
  '@media': {
    [media.mobile]: { minHeight: '44px' },
  },
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '10px 18px',
  borderRadius: '999px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  boxShadow: '0 6px 20px rgba(33, 30, 60, 0.12)',
  color: vars.color.neutral.n900,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  ':hover': { borderColor: vars.color.brand.secondary },
  ':focus-visible': { outline: `2px solid ${vars.color.brand.secondary}`, outlineOffset: '2px' },
});

const reveal = keyframes({
  from: { opacity: 0, filter: 'blur(6px)' },
  to: { opacity: 1, filter: 'blur(0)' },
});

/** 로그인 직후 전체 결과가 흐림에서 또렷해지며 나타나는 전환. */
export const unlockReveal = style({
  animation: `${reveal} 0.6s ease-out both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
