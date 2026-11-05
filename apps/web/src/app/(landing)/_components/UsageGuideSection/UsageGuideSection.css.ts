import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const section = style({
  padding: '80px 0',
  background: 'linear-gradient(180deg, #FBFCFF 0%, #FFFFFF 100%)',
  '@media': { [media.mobile]: { padding: '56px 0', scrollMarginTop: '120px' } },
});
export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '36px',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 40px',
  '@media': { [media.mobile]: { padding: '0 20px', gap: '28px' } },
});
export const guides = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '32px',
  width: '100%',
  '@media': { [media.mobile]: { gridTemplateColumns: '1fr', gap: '24px' } },
});
export const guide = style({
  padding: '32px',
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '16px',
  background: vars.color.white,
  '@media': { [media.mobile]: { padding: '24px 20px' } },
});
export const label = style({
  fontSize: '13px',
  fontWeight: 600,
  color: vars.color.brand.secondary,
  marginBottom: '8px',
});
export const guideTitle = style({
  fontSize: '21px',
  fontWeight: 700,
  color: vars.color.neutral.n900,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
});
export const steps = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  listStyle: 'none',
  padding: 0,
  margin: '28px 0 0',
});
export const step = style({ display: 'flex', alignItems: 'flex-start', gap: '14px' });
export const number = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  flexShrink: 0,
  background: '#f1edfc',
  color: vars.color.brand.secondary,
  borderRadius: '50%',
  fontSize: '13px',
  fontWeight: 600,
});
export const stepTitle = style({ fontSize: '16px', fontWeight: 600, lineHeight: 1.7, color: vars.color.neutral.n700 });
export const description = style({
  fontSize: '14px',
  lineHeight: 1.8,
  color: vars.color.neutral.n600,
  marginTop: '4px',
  wordBreak: 'keep-all',
});
export const note = style({
  fontSize: '13px',
  color: vars.color.neutral.n500,
  lineHeight: 1.8,
  textAlign: 'center',
  wordBreak: 'keep-all',
});
