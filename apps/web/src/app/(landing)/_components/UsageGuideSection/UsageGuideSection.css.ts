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
  alignSelf: 'stretch',
  background: 'linear-gradient(180deg, #FBFCFF 0%, #FFFFFF 100%)',
  minHeight: '90vh',
  justifyContent: 'center',
  padding: '80px 0',
});

export const container = style({
  '@media': {
    [media.compact]: { padding: '0 32px' },
    [media.mobile]: { padding: '0 20px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '0 80px',
});

export const inner = style({
  '@media': {
    [media.mobile]: { gap: '32px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '64px',
  alignSelf: 'stretch',
  opacity: 0,
  transform: 'translateY(28px)',
  transition: 'opacity 0.7s ease, transform 0.7s ease',
});

export const innerVisible = style({
  opacity: 1,
  transform: 'translateY(0)',
});

export const stepsRow = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', gap: '32px' },
  },
  display: 'flex',
  alignItems: 'stretch',
  alignSelf: 'stretch',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const stepItem = style({
  '@media': {
    [media.compact]: { padding: '0 24px', minWidth: 0 },
    [media.mobile]: {
      padding: '0 0 32px',
      gap: '16px',
      selectors: { '&:not(:last-child)': { borderRight: 'none', borderBottom: '1px solid #e5e7eb' } },
    },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  flex: 1,
  padding: '0 48px',
  opacity: 0,
  transform: 'translateY(16px)',
  transition: 'opacity 0.5s ease, transform 0.5s ease',
  selectors: {
    '&:not(:last-child)': {
      borderRight: `1px solid ${vars.color.neutral.n200}`,
    },
  },
});

export const stepItemVisible = style({
  opacity: 1,
  transform: 'translateY(0)',
});

export const delay1 = style({ transitionDelay: '0.1s' });
export const delay2 = style({ transitionDelay: '0.25s' });
export const delay3 = style({ transitionDelay: '0.4s' });

export const stepNumber = style({
  display: 'block',
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontSize: vars.typography.fontSize.md,
  lineHeight: 'normal',
  color: vars.color.brand.primary,
  letterSpacing: '0.5px',
});

export const stepLine = style({
  width: '32px',
  height: '2px',
  backgroundColor: vars.color.brand.primary,
  opacity: 0.4,
  borderRadius: '2px',
  flexShrink: 0,
});

export const stepContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

export const stepTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.bold,
  fontSize: vars.typography.fontSize.xl,
  lineHeight: 'normal',
  color: vars.color.neutral.n900,
  letterSpacing: '-0.24px',
  textAlign: 'center',
  margin: 0,
});

export const stepDescription = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.base,
  lineHeight: '1.7',
  color: vars.color.neutral.n500,
  letterSpacing: '-0.075px',
  textAlign: 'center',
});
