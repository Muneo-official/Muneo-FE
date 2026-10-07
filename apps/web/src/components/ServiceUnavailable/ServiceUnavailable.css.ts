import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: '24px',
  background: vars.color.neutral.nSurface,
});
export const panel = style({
  width: '100%',
  maxWidth: '520px',
  padding: '40px 24px',
  borderRadius: '24px',
  background: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  textAlign: 'center',
  color: vars.color.neutral.n900,
});
export const badge = style({
  padding: '6px 12px',
  borderRadius: '20px',
  background: vars.color.brand.primaryBg,
  color: vars.color.brand.primary,
  fontSize: '13px',
  fontWeight: 600,
});
export const title = style({ fontSize: '26px', fontWeight: 700, lineHeight: 1.4, wordBreak: 'keep-all' });
export const description = style({
  fontSize: '15px',
  lineHeight: 1.8,
  color: vars.color.neutral.n600,
  wordBreak: 'keep-all',
});
export const actions = style({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' });
export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  overflowY: 'auto',
  padding: '24px',
  background: 'rgba(17, 24, 39, 0.45)',
  display: 'grid',
  placeItems: 'center',
});
