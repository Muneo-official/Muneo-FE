import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(24px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const bounce = keyframes({
  '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
  '50%': { transform: 'translateX(-50%) translateY(6px)' },
});

const fadeUpCenter = keyframes({
  from: { opacity: 0, transform: 'translateX(-50%) translateY(24px)' },
  to: { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
});

export const section = style({
  '@media': {
    [media.tablet]: { minHeight: '100svh' },
    [media.mobile]: { marginTop: '-104px', padding: '144px 0 64px' },
  },
  position: 'relative',
  display: 'flex',
  padding: '124px 0 48px',
  marginTop: '-72px',
  minHeight: '100vh',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  background: 'linear-gradient(180deg, rgba(69, 62, 239, 0.15) 0%, rgba(155, 134, 255, 0.02) 100%)',
});

export const container = style({
  '@media': {
    [media.compact]: { padding: '0 32px 6vh', gap: '100px' },
    [media.mobile]: { padding: '0 20px', gap: '36px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '220px',
  width: '100%',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '0 80px 6vh',
});

export const row = style({
  '@media': {
    [media.compact]: { flexDirection: 'column', gap: '40px', alignItems: 'stretch' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignSelf: 'stretch',
});

export const left = style({
  '@media': {
    [media.compact]: { alignItems: 'center', textAlign: 'center' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '21px',
});

export const headline = style({
  '@media': {
    [media.mobile]: { fontSize: 'clamp(28px, 7.5vw, 38px)', lineHeight: 1.35 },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: '42px',
  fontWeight: 700,
  fontStyle: 'normal',
  lineHeight: 'normal',
});

export const headlineLine1 = style({
  color: vars.color.neutral.n900,
  opacity: 0,
  animation: `${fadeUp} 0.7s ease forwards`,
  animationDelay: '0.1s',
});

export const headlineLine2 = style({
  backgroundImage: 'linear-gradient(93.86deg, #b58fff 0.12%, #6d3fc5 84.54%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  opacity: 0,
  animation: `${fadeUp} 0.7s ease forwards`,
  animationDelay: '0.25s',
});

export const subContent = style({
  '@media': {
    [media.compact]: { alignItems: 'center', gap: '24px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '39px',
  alignSelf: 'stretch',
  opacity: 0,
  animation: `${fadeUp} 0.7s ease forwards`,
  animationDelay: '0.4s',
});

export const descriptionSection = style({
  '@media': {
    [media.compact]: { alignItems: 'center' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  alignSelf: 'stretch',
});

export const descriptionText = style({
  '@media': {
    [media.mobile]: { lineHeight: 1.6 },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.medium,
  fontSize: vars.typography.fontSize.md,
  lineHeight: 'normal',
  color: vars.color.neutral.n500,
  opacity: 0.7,
  letterSpacing: '-0.08px',
});

export const divider = style({
  width: '0.8px',
  height: '23px',
  opacity: 0.7,
  backgroundColor: vars.color.neutral.n500,
  flexShrink: 0,
});

export const ctaWrapper = style({
  '@media': {
    [media.compact]: { alignItems: 'center' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  alignSelf: 'stretch',
});

export const ctaButton = style({
  borderRadius: '25px',
  fontSize: vars.typography.fontSize.md,
  letterSpacing: '-0.128px',
});

export const right = style({
  '@media': {
    [media.compact]: { width: '100%', maxWidth: '540px', alignSelf: 'center' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '21px',
  opacity: 0,
  animation: `${fadeUp} 0.7s ease forwards`,
  animationDelay: '0.3s',
});

export const previewCard = style({
  '@media': {
    [media.compact]: { width: '100%' },
    [media.mobile]: { padding: '20px 16px 28px' },
  },
  margin: 0,
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.08)',
  borderRadius: '4px',
  padding: '19px 32px 82px 32px',
});

export const previewInner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '31px',
});

export const previewTop = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  width: '100%',
});

export const previewLabel = style({
  display: 'block',
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontSize: vars.typography.fontSize.sm,
  lineHeight: 'normal',
  color: vars.color.neutral.n400,
  letterSpacing: '-0.07px',
});

export const statusCardsRow = style({
  '@media': {
    [media.compact]: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' },
    [media.mobile]: { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
  display: 'flex',
  gap: '18px',
  alignItems: 'center',
});

export const recentSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

export const recentLabel = style({
  display: 'block',
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.medium,
  fontSize: '12px',
  lineHeight: 'normal',
  color: vars.color.neutral.n500,
  letterSpacing: '-0.06px',
});

export const recentList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const recentItem = style({
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: '12px',
  lineHeight: 'normal',
  color: '#4b5563',
});

export const subHeadline = style({
  '@media': {
    [media.mobile]: { fontSize: '16px', lineHeight: 1.6 },
  },
  fontFamily: vars.typography.fontFamilyDisplay,
  fontWeight: vars.typography.fontWeight.medium,
  fontSize: vars.typography.fontSize.lg,
  lineHeight: 'normal',
  color: '#6d40c5',
  letterSpacing: '-0.16px',
  textAlign: 'center',
  alignSelf: 'stretch',
  opacity: 0,
  animation: `${fadeUp} 0.7s ease forwards`,
  animationDelay: '0.55s',
});

export const scrollIndicator = style({
  '@media': {
    [media.mobile]: { bottom: '12px' },
  },
  position: 'absolute',
  bottom: '36px',
  left: '50%',
  opacity: 0,
  animation: `${fadeUpCenter} 0.6s ease forwards, ${bounce} 1.8s ease-in-out infinite`,
  animationDelay: '0.8s, 1.4s',
  color: 'rgba(109, 64, 197, 0.4)',
  background: 'transparent',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'color 200ms ease',
  selectors: {
    '&:hover': {
      color: 'rgba(109, 64, 197, 0.8)',
    },
    '&:focus-visible': {
      outline: '2px solid rgba(109, 64, 197, 0.6)',
      outlineOffset: '4px',
    },
  },
});
