import { media, vars } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const fadeSlideDown = keyframes({
  from: { opacity: 0, transform: 'translateY(-10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
});

export const header = style({
  '@media': {
    [media.compact]: { flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'normal' },
  },
  display: 'flex',
  alignItems: 'flex-end',
  gap: '13px',
  flexShrink: 0,
});

export const title = style({
  '@media': {
    [media.mobile]: { fontSize: '20px', lineHeight: 1.5 },
  },
  fontSize: vars.typography.fontSize.xl,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
  margin: 0,
});

export const titleAccent = style({
  color: vars.color.brand.secondary,
});

export const titleHint = style({
  '@media': {
    [media.compact]: { whiteSpace: 'normal', lineHeight: 1.5 },
  },
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const card = style({
  '@media': {
    [media.mobile]: { minHeight: 0 },
  },
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  minHeight: '630px',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const tabBar = style({
  '@media': {
    [media.mobile]: { padding: '0 16px', gap: '8px' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '0 40px',
  flexShrink: 0,
});

const tabBase = style({
  height: '50px',
  width: '134px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontFamily: vars.typography.fontFamily,
  lineHeight: '14px',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  borderBottom: '1.5px solid transparent',
  transition: 'color 0.15s ease, border-color 0.15s ease',
});

export const tabActive = style([
  tabBase,
  { color: vars.color.brand.secondary, borderBottomColor: vars.color.brand.secondary },
]);
export const tabInactive = style([tabBase, { color: vars.color.neutral.n500, borderBottomColor: 'transparent' }]);

export const cardBody = style({
  '@media': {
    [media.compact]: { padding: '28px 24px' },
    [media.mobile]: { padding: '24px 16px', gap: '28px' },
  },
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '45px',
  padding: '40px 40px',
  overflowY: 'auto',
});

export const processSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

export const sectionLabel = style({
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n500,
  lineHeight: 'normal',
});

export const processGrid = style({
  '@media': {
    [media.compact]: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
    [media.mobile]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const processRow = style({
  '@media': {
    [media.compact]: { display: 'contents' },
  },
  display: 'flex',
  gap: '28px',
  alignItems: 'center',
});

export const actions = style({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  height: '45px',
  flexShrink: 0,
});

export const detailSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  animation: `${fadeSlideDown} 0.4s cubic-bezier(0.4, 0, 0.2, 1) both`,
});

export const detailDivider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.neutral.n200,
});

export const detailHint = style({
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n400,
  lineHeight: '1.6',
  margin: 0,
});

export const detailTitle = style({
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n600,
  lineHeight: 'normal',
});

export const accordionList = style({
  display: 'flex',
  flexDirection: 'column',
});

export const accordionItem = style({
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
  selectors: {
    '&:first-child': {
      borderTop: `1px solid ${vars.color.neutral.n200}`,
    },
  },
});

export const accordionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '14px 0',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  ':hover': { opacity: 0.75 },
});

export const accordionHeaderText = style({
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
  transition: 'color 0.25s ease',
});

export const accordionHeaderTextOpen = style({
  color: vars.color.brand.secondary,
});

export const accordionChevron = style({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease',
  color: vars.color.neutral.n500,
  flexShrink: 0,
});

export const accordionChevronOpen = style({
  transform: 'rotate(180deg)',
  color: vars.color.brand.secondary,
});

export const accordionBody = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
});

export const accordionBodyOpen = style({
  gridTemplateRows: '1fr',
});

export const accordionBodyInner = style({
  overflow: 'hidden',
  paddingBottom: '0px',
  transition: 'padding-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
});

export const accordionBodyInnerOpen = style({
  paddingBottom: '20px',
});

export const sectionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

export const fieldLabel = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const buttonRow = style({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const conditionalField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingLeft: '14px',
  borderLeft: `2px solid ${vars.color.brand.secondary}`,
});

export const infoNote = style({
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n500,
  lineHeight: '1.5',
  padding: '8px 12px',
  backgroundColor: vars.color.neutral.n100,
  borderRadius: vars.radius.base,
  margin: 0,
});

export const optionalGrid = style({
  display: 'flex',
  gap: '28px',
  alignItems: 'stretch',
  '@media': {
    [media.compact]: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
    [media.mobile]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' },
  },
});
