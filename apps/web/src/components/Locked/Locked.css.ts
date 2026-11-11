import { vars } from '@muneo/design-system';
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

export const icon = style({
  flexShrink: 0,
  color: 'currentColor',
});

export const bar = style({
  display: 'inline-block',
  flexShrink: 1,
  minWidth: '2em',
  maxWidth: '100%',
  height: '0.75em',
  borderRadius: '4px',
  backgroundColor: 'currentColor',
  opacity: 0.12,
  verticalAlign: 'middle',
});

export const value = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  maxWidth: '100%',
  whiteSpace: 'nowrap',
});

export const area = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderRadius: '12px',
  color: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  ':focus-visible': { outline: `2px solid ${vars.color.brand.secondary}`, outlineOffset: '4px' },
});

export const placeholder = style({
  display: 'block',
  userSelect: 'none',
});

export const label = style({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: '6px',
  padding: '4px 0',
  color: vars.color.brand.secondary,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.semiBold,
  lineHeight: 1.5,
  textUnderlineOffset: '4px',
  selectors: {
    [`${area}:hover &`]: { textDecoration: 'underline' },
  },
});

const reveal = keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 로그인 직후 전체 결과가 자연스럽게 나타나는 전환 */
export const unlockReveal = style({
  animation: `${reveal} 0.4s ease-out both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
