import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const footer = style({
  backgroundColor: vars.color.white,
  borderTop: `1px solid ${vars.color.neutral.n200}`,
  marginTop: '60px',
});

export const container = style({
  '@media': {
    [media.tablet]: { padding: '32px' },
    [media.mobile]: { padding: '32px 20px' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '40px 80px',
});

export const main = style({
  '@media': {
    [media.tablet]: { gap: '32px' },
    [media.mobile]: { flexDirection: 'column' },
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export const brand = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const logoRow = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export const tagline = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.xs,
  color: '#8a7da5',
  letterSpacing: '-0.08px',
});

export const description = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
  lineHeight: '1.7',
  letterSpacing: '-0.065px',
});

export const links = style({
  '@media': {
    [media.tablet]: { gap: '32px' },
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  gap: '80px',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const linkGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const linkGroupTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n900,
  letterSpacing: '-0.065px',
  margin: 0,
});

export const linkGroupItems = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const linkItem = style({
  '@media': {
    [media.mobile]: { display: 'inline-flex', alignItems: 'center', minHeight: '44px' },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n500,
  lineHeight: '1.5',
  letterSpacing: '-0.065px',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  ':hover': {
    color: vars.color.neutral.n700,
  },
});

export const divider = style({
  border: 'none',
  height: '1px',
  backgroundColor: vars.color.neutral.n200,
  opacity: 0.6,
});

export const bottom = style({
  display: 'flex',
  alignItems: 'center',
});

export const copyright = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n400,
  letterSpacing: '-0.06px',
});
