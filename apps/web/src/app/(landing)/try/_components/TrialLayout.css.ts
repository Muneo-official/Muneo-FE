import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';
const spin = keyframes({ to: { transform: 'rotate(360deg)' } });
export const page = style({
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: '40px 32px 72px',
  minHeight: '75vh',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  color: vars.color.neutral.n900,
  '@media': { [media.mobile]: { padding: '28px 20px 48px', gap: '24px' } },
});
export const heading = style({
  fontSize: 'clamp(24px, 3vw, 32px)',
  fontWeight: 700,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
  scrollMarginTop: '130px',
  outline: 'none',
});
export const header = style({ display: 'flex', flexDirection: 'column', gap: '12px' });
export const text = style({ color: vars.color.neutral.n600, lineHeight: 1.8, fontSize: '15px', wordBreak: 'keep-all' });
export const eyebrow = style({ fontSize: '13px', color: vars.color.brand.secondary, fontWeight: 600 });
export const inputLayout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  alignItems: 'start',
  gap: '24px',
  '@media': { [media.tablet]: { gridTemplateColumns: '1fr' } },
});
export const notice = style({
  padding: '16px 20px',
  borderRadius: '12px',
  background: vars.color.brand.primaryBg,
  fontSize: '14px',
  lineHeight: 1.8,
  color: vars.color.neutral.n700,
  wordBreak: 'keep-all',
});
export const error = style({
  padding: '16px',
  borderRadius: '10px',
  background: '#fff2f2',
  color: '#a42d35',
  lineHeight: 1.7,
});
export const loading = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  minHeight: '420px',
  textAlign: 'center',
});
export const spinner = style({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '3px solid #e8e0f7',
  borderTopColor: vars.color.brand.secondary,
  animation: `${spin} 1s linear infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
export const resultGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
  gap: '24px',
  alignItems: 'start',
  '@media': { [media.tablet]: { gridTemplateColumns: '1fr' } },
});
export const card = style({
  border: '1px solid #e5def4',
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  background: vars.color.white,
  '@media': { [media.mobile]: { padding: '24px 20px' } },
});
export const cardTitle = style({ fontSize: '21px', fontWeight: 700, lineHeight: 1.5, wordBreak: 'keep-all' });
export const badges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  fontSize: '14px',
  color: vars.color.neutral.n700,
});
export const badge = style({ padding: '8px 12px', borderRadius: '8px', background: '#f4f1fb' });
export const gate = style({
  border: '1px solid #d9cef1',
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  background: 'linear-gradient(135deg,#f2edfc,#faf9ff)',
  '@media': { [media.mobile]: { padding: '24px 20px' } },
});
export const skeleton = style({ height: '12px', borderRadius: '6px', background: '#e4dcf2', width: '85%' });
export const masked = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px',
  background: 'rgba(255,255,255,.65)',
  borderRadius: '12px',
});
export const actions = style({ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' });
export const link = style({
  display: 'inline-flex',
  minHeight: '44px',
  alignItems: 'center',
  color: vars.color.brand.secondary,
  textUnderlineOffset: '4px',
  fontSize: '14px',
});
export const small = style({ fontSize: '13px', lineHeight: 1.7, color: vars.color.neutral.n500 });
