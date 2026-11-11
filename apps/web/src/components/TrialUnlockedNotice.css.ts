import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const notice = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: vars.color.semantic.successBg,
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: vars.color.neutral.n700,
  lineHeight: 1.6,
});

export const icon = style({
  flexShrink: 0,
  marginTop: '2px',
  color: vars.color.semantic.success,
});

export const lead = style({
  color: vars.color.neutral.n900,
  fontWeight: vars.typography.fontWeight.bold,
});
