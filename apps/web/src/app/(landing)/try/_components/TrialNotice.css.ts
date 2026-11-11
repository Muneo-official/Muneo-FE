import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const notice = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', alignItems: 'flex-start', gap: '8px' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1px solid ${vars.color.brand.primaryLight}`,
  backgroundColor: vars.color.brand.primaryBg,
});

export const badge = style({
  flexShrink: 0,
  padding: '4px 10px',
  borderRadius: '999px',
  backgroundColor: vars.color.white,
  color: vars.color.brand.primary,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xxs,
  fontWeight: vars.typography.fontWeight.bold,
  whiteSpace: 'nowrap',
});

export const text = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n700,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
});
