import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  background: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media': { [media.mobile]: { padding: '20px 16px' } },
});
export const title = style({ fontSize: '20px', fontWeight: 700, lineHeight: 1.5, color: vars.color.neutral.n900 });
export const hint = style({ fontSize: '14px', lineHeight: 1.7, color: vars.color.neutral.n600 });
export const notice = style({
  fontSize: '13px',
  lineHeight: 1.6,
  padding: '10px 14px',
  background: vars.color.neutral.n100,
  borderRadius: '8px',
  color: vars.color.neutral.n700,
});
export const row = style({ display: 'flex', flexWrap: 'wrap', gap: '10px' });
export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  border: 0,
  margin: 0,
  padding: 0,
  minWidth: 0,
});
export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '14px',
  lineHeight: 1.6,
  color: vars.color.neutral.n700,
});
export const textarea = style({
  width: '100%',
  minHeight: '100px',
  padding: '12px',
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: '8px',
  font: 'inherit',
  lineHeight: 1.7,
  resize: 'vertical',
});
export const error = style({ color: vars.color.semantic.danger, fontSize: '14px', lineHeight: 1.6 });
