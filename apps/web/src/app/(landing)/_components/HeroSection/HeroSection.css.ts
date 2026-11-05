import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const fadeUp = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
export const section = style({
  position: 'relative',
  padding: '80px 0 64px',
  background: 'linear-gradient(180deg, rgba(69, 62, 239, 0.11) 0%, rgba(155, 134, 255, 0.02) 100%)',
  '@media': { [media.tablet]: { padding: '56px 0 64px' }, [media.mobile]: { padding: '40px 0 64px' } },
});
export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  width: '100%',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 48px',
  '@media': { [media.tablet]: { padding: '0 32px' }, [media.mobile]: { padding: '0 20px', gap: '32px' } },
});
export const row = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
  alignItems: 'center',
  gap: '56px',
  '@media': { [media.tablet]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: '40px' } },
});
export const left = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  animation: `${fadeUp} 0.6s ease both`,
  '@media': {
    [media.tablet]: { alignItems: 'center', textAlign: 'center' },
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
export const eyebrow = style({ fontSize: '14px', fontWeight: 600, color: vars.color.brand.secondary });
export const headline = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: 'clamp(32px, 3.2vw, 44px)',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-1.2px',
  color: vars.color.neutral.n900,
  wordBreak: 'keep-all',
  '@media': { [media.mobile]: { fontSize: 'clamp(26px, 7vw, 38px)', letterSpacing: '-0.8px' } },
});
export const headlineAccent = style({ color: '#7043b8' });
export const description = style({
  fontSize: '16px',
  color: vars.color.neutral.n600,
  lineHeight: 1.8,
  wordBreak: 'keep-all',
  marginBottom: '8px',
});
export const previewCard = style({
  width: '100%',
  maxWidth: '540px',
  justifySelf: 'center',
  margin: 0,
  padding: '28px',
  border: '1px solid #e5def4',
  borderRadius: '20px',
  background: vars.color.white,
  boxShadow: '0 16px 48px rgba(74, 45, 125, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  animation: `${fadeUp} 0.6s ease 0.1s both`,
  '@media': {
    [media.mobile]: { padding: '20px', gap: '16px' },
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
export const previewHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  fontSize: '14px',
  fontWeight: 600,
  color: vars.color.neutral.n700,
});
export const exampleBadge = style({
  flexShrink: 0,
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  color: vars.color.neutral.n600,
  background: vars.color.neutral.n100,
});
export const document = style({
  padding: '16px 20px',
  borderRadius: '10px',
  background: '#f8f9fc',
  borderLeft: '3px solid #d9dce7',
});
export const documentLabel = style({ fontSize: '12px', color: vars.color.neutral.n500 });
export const documentTitle = style({
  fontSize: '15px',
  fontWeight: 600,
  margin: '8px 0 4px',
  color: vars.color.neutral.n700,
});
export const documentText = style({ fontSize: '14px', lineHeight: 1.6, color: vars.color.neutral.n600 });
export const finding = style({ display: 'flex', flexDirection: 'column', gap: '10px' });
export const findingLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#9a5a11',
  fontSize: '13px',
  fontWeight: 600,
});
export const findingTitle = style({
  fontSize: '19px',
  lineHeight: 1.5,
  fontWeight: 700,
  color: vars.color.neutral.n900,
  wordBreak: 'keep-all',
});
export const findingText = style({
  fontSize: '14px',
  lineHeight: 1.8,
  color: vars.color.neutral.n600,
  wordBreak: 'keep-all',
});
export const question = style({
  padding: '16px',
  borderRadius: '12px',
  background: '#f4f0fc',
  fontSize: '14px',
  lineHeight: 1.8,
  color: '#543585',
  wordBreak: 'keep-all',
});
export const questionLabel = style({ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' });
export const previewFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '12px',
  lineHeight: 1.7,
  color: vars.color.neutral.n500,
});
export const previewLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  alignSelf: 'flex-start',
  minHeight: '44px',
  fontSize: '13px',
  fontWeight: 600,
  color: vars.color.brand.secondary,
  textUnderlineOffset: '4px',
});
export const subHeadline = style({
  fontSize: '15px',
  textAlign: 'center',
  color: vars.color.neutral.n600,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
});
export const scrollIndicator = style({
  position: 'absolute',
  bottom: '8px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  border: 'none',
  background: 'transparent',
  color: '#8061b0',
  cursor: 'pointer',
  borderRadius: '8px',
  ':focus-visible': { outline: `2px solid ${vars.color.brand.primary}`, outlineOffset: '2px' },
});
