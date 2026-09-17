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
  minHeight: '90vh',
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
  maxWidth: '1440px',
  height: '100%',
  margin: '0 auto',
  padding: '36px 160px 34px',
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
  opacity: 0,
  transform: 'translateY(28px)',
  transition: 'opacity 0.7s ease, transform 0.7s ease',
});

export const innerVisible = style({
  opacity: 1,
  transform: 'translateY(0)',
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
  padding: '20px 100px 59px 28px',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, #EEF0FF 0%, rgba(238, 240, 255, 0.09) 100%)',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.12)',
  alignSelf: 'stretch',
  flex: '1 0 0',
  opacity: 0,
  transform: 'translateY(16px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
});

export const cardVisible = style({
  opacity: 1,
  transform: 'translateY(0)',
});

export const delay1 = style({ transitionDelay: '0.1s' });
export const delay2 = style({ transitionDelay: '0.25s' });
export const delay3 = style({ transitionDelay: '0.4s' });

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
  lineHeight: '18px',
  color: vars.color.neutral.n500,
});
