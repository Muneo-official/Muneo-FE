import { globalStyle } from '@vanilla-extract/css';
import { media } from './responsive';
import { vars } from './tokens.css';

globalStyle('*, *::before, *::after', {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
});

globalStyle('html', {
  fontFamily: vars.typography.fontFamily,
  WebkitTextSizeAdjust: '100%',
  lineHeight: vars.typography.lineHeight.lg,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
  color: vars.color.neutral.n900,
  backgroundColor: vars.color.white,
});

globalStyle('button, input, textarea, select', {
  fontFamily: 'inherit',
});

globalStyle('input, textarea, select', {
  '@media': { [media.mobile]: { fontSize: '16px' } },
});
