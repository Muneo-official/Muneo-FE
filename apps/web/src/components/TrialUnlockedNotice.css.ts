import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const notice = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: vars.color.semantic.successBg,
  color: vars.color.semantic.success,
});

export const text = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n700,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
});
