import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const notice = style({
  padding: '16px',
  borderRadius: '12px',
  background: vars.color.brand.primaryBg,
  color: vars.color.neutral.n600,
  fontSize: '13px',
  lineHeight: 1.7,
  wordBreak: 'keep-all',
});
export const title = style({ fontSize: '15px', fontWeight: 600, color: vars.color.neutral.n900, marginBottom: '4px' });
