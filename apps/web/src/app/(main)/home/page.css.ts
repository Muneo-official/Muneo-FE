import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  '@media': {
    [media.compact]: { padding: '32px 32px 100px' },
    [media.mobile]: { padding: '28px 16px 100px', minHeight: 'calc(100dvh - 64px)' },
  },
  backgroundColor: '#f8f9fc',
  minHeight: '100vh',
  padding: '46px 60px 100px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '1280px',
  margin: '0 auto',
});

export const greetingSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

export const greetingTitle = style({
  fontSize: '24px',
  fontFamily: vars.typography.fontFamilyDisplay,
  fontWeight: vars.typography.fontWeight.bold,
  color: 'rgba(17, 24, 39, 0.85)',
  lineHeight: 'normal',
  margin: 0,
});

export const greetingName = style({
  color: vars.color.brand.primary,
});

export const greetingSubtitle = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n500,
  letterSpacing: '-0.112px',
  opacity: 0.9,
  margin: 0,
});

export const actions = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '20px',
  margin: '12px 0 24px',
  '@media': { [media.mobile]: { gridTemplateColumns: '1fr' } },
});
export const actionCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '28px',
  borderRadius: '20px',
  background: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  textDecoration: 'none',
  ':hover': { borderColor: vars.color.brand.primary },
  ':focus-visible': { outline: `3px solid ${vars.color.brand.primary}`, outlineOffset: '3px' },
  '@media': { [media.mobile]: { padding: '24px 20px' } },
});
export const actionEyebrow = style({ color: vars.color.brand.primary, fontSize: '14px', fontWeight: 600 });
export const actionTitle = style({
  color: vars.color.neutral.n900,
  fontSize: '23px',
  fontWeight: 700,
  lineHeight: 1.5,
});
export const actionDescription = style({
  color: vars.color.neutral.n600,
  fontSize: '15px',
  lineHeight: 1.8,
  wordBreak: 'keep-all',
});
