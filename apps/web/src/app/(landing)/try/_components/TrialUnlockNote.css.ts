import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const note = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  width: '100%',
  padding: '16px 18px',
  borderRadius: '12px',
  border: `1px solid ${vars.color.brand.primaryLight}`,
  backgroundColor: vars.color.brand.primaryBg,
});

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: vars.color.white,
  color: vars.color.brand.primary,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  minWidth: 0,
});

export const title = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  wordBreak: 'keep-all',
});

export const text = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n600,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
});

export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '36px',
  color: vars.color.brand.secondary,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  textUnderlineOffset: '4px',
});
