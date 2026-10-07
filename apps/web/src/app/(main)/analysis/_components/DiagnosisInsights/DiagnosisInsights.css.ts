import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  border: `1px solid ${vars.color.brand.primaryLight}`,
  borderRadius: '20px',
  padding: '28px',
  background: vars.color.brand.primaryBg,
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  '@media': { [media.mobile]: { padding: '20px 16px' } },
});
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'space-between',
});
export const eyebrow = style({ color: vars.color.brand.primary, fontSize: '13px', fontWeight: 700 });
export const title = style({
  color: vars.color.neutral.n900,
  fontSize: '22px',
  fontWeight: 700,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
});
export const description = style({
  color: vars.color.neutral.n600,
  fontSize: '14px',
  lineHeight: 1.7,
  wordBreak: 'keep-all',
});
export const list = style({ display: 'grid', gap: '12px', padding: 0, listStyle: 'none' });
export const item = style({
  background: vars.color.white,
  padding: '18px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
export const itemTitle = style({ fontSize: '16px', fontWeight: 600, lineHeight: 1.6, color: vars.color.neutral.n900 });
export const link = style({
  color: vars.color.brand.primary,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontSize: '14px',
  padding: '8px 0',
  alignSelf: 'flex-start',
});
export const copyText = style({
  width: '100%',
  minHeight: '160px',
  padding: '12px',
  lineHeight: 1.7,
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: '8px',
  resize: 'vertical',
  background: vars.color.white,
});
