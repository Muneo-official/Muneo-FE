import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const section = style({
  '@media': {
    [media.tablet]: { minHeight: 'auto', padding: '64px 0', scrollMarginTop: '80px' },
    [media.mobile]: { scrollMarginTop: '104px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '80px 0',
  justifyContent: 'center',
  alignSelf: 'stretch',
  background: '#FBFCFF',
});

export const container = style({
  '@media': {
    [media.compact]: { padding: '0 32px' },
    [media.mobile]: { padding: '0 20px' },
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  maxWidth: '1200px',
  height: '100%',
  margin: '0 auto',
  padding: '0 40px',
});

export const inner = style({
  '@media': {
    [media.mobile]: { gap: '32px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '49px',
  alignSelf: 'stretch',
});

export const cardsRow = style({
  '@media': {
    [media.tablet]: { gap: '16px' },
    [media.mobile]: { flexDirection: 'column' },
  },
  display: 'flex',
  gap: '32px',
  alignItems: 'center',
  alignSelf: 'stretch',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const card = style({
  '@media': {
    [media.compact]: { padding: '24px', minWidth: 0 },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '32px',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, #EEF0FF 0%, rgba(238, 240, 255, 0.09) 100%)',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.12)',
  alignSelf: 'stretch',
  flex: '1 0 0',
});

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '22px',
});

export const cardNumber = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.extraBold,
  fontSize: vars.typography.fontSize.xl,
  lineHeight: 'normal',
  color: '#4b386f',
  margin: 0,
});

export const cardTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.extraBold,
  fontSize: vars.typography.fontSize.xl,
  lineHeight: 'normal',
  color: '#4b386f',
  alignSelf: 'stretch',
  margin: 0,
});

export const cardDescription = style({
  '@media': {
    [media.mobile]: { lineHeight: 1.7 },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.base,
  lineHeight: '1.8',
  wordBreak: 'keep-all',
  color: vars.color.neutral.n500,
});
