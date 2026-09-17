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
  backgroundColor: vars.color.white,
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

export const faqList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  maxWidth: '800px',
});

export const faqItem = style({
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: vars.radius.md,
  backgroundColor: vars.color.white,
  overflow: 'hidden',
  boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.03)',
  transition: 'border-color 0.2s ease',
});

export const questionHeading = style({
  margin: 0,
  padding: 0,
  fontSize: 'inherit',
  fontWeight: 'inherit',
});

export const faqQuestion = style({
  '@media': {
    [media.mobile]: { padding: '20px 16px' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  padding: vars.space['2xl'],
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  ':hover': {
    backgroundColor: vars.color.neutral.n100,
  },
  transition: 'background-color 0.15s ease',
});

export const faqQuestionActive = style({
  backgroundColor: vars.color.brand.primaryBg,
  ':hover': {
    backgroundColor: vars.color.brand.primaryBg,
  },
});

export const questionText = style({
  '@media': {
    [media.mobile]: { fontSize: '15px', lineHeight: 1.5 },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontSize: vars.typography.fontSize.md,
  lineHeight: 'normal',
  color: vars.color.neutral.n900,
  letterSpacing: '-0.16px',
});

export const questionTextActive = style({
  fontWeight: vars.typography.fontWeight.bold,
});

export const chevron = style({
  flexShrink: 0,
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.neutral.n400,
  transition: 'transform 0.2s ease, color 0.15s ease',
});

export const chevronActive = style({
  transform: 'rotate(180deg)',
  color: vars.color.brand.primary,
});

export const faqAnswer = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  transition: 'grid-template-rows 0.3s ease',
});

export const faqAnswerOpen = style({
  gridTemplateRows: '1fr',
});

export const faqAnswerInner = style({
  overflow: 'hidden',
  minHeight: 0,
});

export const answerText = style({
  '@media': {
    [media.mobile]: { padding: '20px 16px' },
  },
  padding: vars.space['2xl'],
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.base,
  lineHeight: '1.7',
  color: vars.color.neutral.n700,
  letterSpacing: '-0.075px',
});
