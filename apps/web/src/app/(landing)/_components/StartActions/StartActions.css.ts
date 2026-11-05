import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '540px',
});
export const actions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  '@media': { [media.mobile]: { gap: '12px' }, 'screen and (max-width: 359px)': { gridTemplateColumns: '1fr' } },
});
export const action = style({ display: 'flex', flexDirection: 'column', gap: '8px' });
export const prompt = style({
  fontSize: '13px',
  color: vars.color.neutral.n600,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
});
export const button = style({
  width: '100%',
  minHeight: '52px',
  fontSize: '15px',
  padding: '14px 12px',
  ':focus-visible': { outline: `2px solid ${vars.color.brand.primary}`, outlineOffset: '4px' },
});
export const note = style({
  fontSize: '13px',
  lineHeight: 1.7,
  color: vars.color.neutral.n500,
  wordBreak: 'keep-all',
});
