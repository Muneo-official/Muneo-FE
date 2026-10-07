import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  fontFamily: vars.typography.fontFamily,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  textAlign: 'center',
});
export const links = style({ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '12px' });
export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  minHeight: '44px',
  color: vars.color.brand.secondary,
  fontSize: '12px',
  lineHeight: 1.6,
  textUnderlineOffset: '3px',
});
export const newTab = style({ fontSize: '11px', color: vars.color.neutral.n500 });
export const hint = style({ fontSize: '11px', lineHeight: 1.7, color: vars.color.neutral.n500 });
