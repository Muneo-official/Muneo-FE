import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  maxWidth: '960px',
  margin: '0 auto',
  padding: '48px 20px 80px',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  color: vars.color.neutral.n900,
});
export const header = style({ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: 1.8 });
export const badge = style({ fontSize: '13px', fontWeight: 600, color: vars.color.brand.primary });
export const title = style({ fontSize: '30px', fontWeight: 700, lineHeight: 1.4, wordBreak: 'keep-all' });
