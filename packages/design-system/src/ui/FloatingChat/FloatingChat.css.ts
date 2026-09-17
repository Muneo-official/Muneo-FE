import { style } from '@vanilla-extract/css';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const root = style({
  '@media': {
    [media.mobile]: { maxHeight: 'none' },
  },
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  maxWidth: '460px',
  maxHeight: '680px',
  paddingBottom: vars.space.lg,
  backgroundColor: vars.color.white,
  borderRadius: vars.radius.md,
  overflow: 'hidden',
  boxShadow: '0 12px 32px rgba(17, 24, 39, 0.12)',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '56px',
  paddingTop: vars.space.xs,
  paddingBottom: vars.space.xs,
  paddingLeft: vars.space.lg,
  paddingRight: '10px',
  backgroundImage: `linear-gradient(173deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryLight} 100%)`,
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  flexShrink: 0,
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
});

export const logo = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  overflow: 'hidden',
  flexShrink: 0,
});

export const titleBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  minWidth: 0,
  color: vars.color.white,
});

export const title = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '15px',
  fontWeight: vars.typography.fontWeight.bold,
  lineHeight: 1.2,
});

export const subtitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '10px',
  fontWeight: vars.typography.fontWeight.regular,
  lineHeight: 1.2,
});

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
});

export const iconButton = style({
  '@media': {
    [media.mobile]: { width: '44px', height: '44px' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: vars.color.white,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    '&:focus-visible': {
      outline: `2px solid ${vars.color.white}`,
      outlineOffset: '2px',
    },
  },
});

export const body = style({
  '@media': {
    [media.mobile]: { minHeight: 0 },
  },
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  paddingTop: vars.space.xl,
  paddingBottom: vars.space.lg,
  gap: vars.space.lg,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(109, 64, 197, 0.25) transparent',
  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(109, 64, 197, 0.25)',
      borderRadius: '999px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(109, 64, 197, 0.45)',
    },
  },
});

export const messageRow = style({
  display: 'flex',
  width: '100%',
});

export const aiRow = style([
  messageRow,
  {
    gap: vars.space.sm,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
]);

export const userRow = style([
  messageRow,
  {
    justifyContent: 'flex-end',
  },
]);

export const avatar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  overflow: 'hidden',
  flexShrink: 0,
});

export const footer = style({
  width: '100%',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  flexShrink: 0,
});
