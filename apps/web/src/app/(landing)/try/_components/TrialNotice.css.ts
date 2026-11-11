import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const notice = style({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: vars.color.brand.primaryBg,
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: vars.color.neutral.n700,
  lineHeight: 1.6,
});

export const lead = style({
  color: vars.color.brand.primary,
  fontWeight: vars.typography.fontWeight.bold,
});
