import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const sidebar = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: vars.layout.sidebarWidth,
  height: '100dvh',
  backgroundColor: vars.color.white,
  boxShadow: '2px 0 3px rgba(0, 0, 0, 0.06)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: '40px',
  paddingBottom: '16px',
  paddingLeft: vars.space.sm,
  paddingRight: vars.space.sm,
  zIndex: 100,
  overflowY: 'auto',
  '@media': {
    [media.tablet]: {
      width: '100%',
      height: 'auto',
      padding: 0,
      overflowY: 'visible',
    },
  },
});

export const mobileBar = style({
  display: 'none',
  '@media': {
    [media.tablet]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      padding: '0 16px',
      borderBottom: `1px solid ${vars.color.neutral.n200}`,
    },
  },
});

export const menuToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minWidth: '80px',
  minHeight: '44px',
  padding: '8px 12px',
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '10px',
  backgroundColor: vars.color.white,
  color: vars.color.neutral.n700,
  cursor: 'pointer',
});

export const menuPanel = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '24px',
  flex: 1,
  '@media': {
    [media.tablet]: {
      display: 'none',
      maxHeight: 'calc(100dvh - 64px)',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      padding: '12px 16px calc(16px + env(safe-area-inset-bottom))',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
    },
  },
});

export const menuPanelOpen = style({
  '@media': { [media.tablet]: { display: 'flex' } },
});

export const topSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['2xl'],
});

export const logoArea = style({
  '@media': { [media.tablet]: { display: 'none' } },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
  width: 'fit-content',
  alignSelf: 'center',
});

export const tagline = style({
  display: 'block',
  width: '100%',
  fontFamily: vars.typography.fontFamily,
  fontSize: '8px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n400,
  textAlign: 'justify',
  textAlignLast: 'justify',
  lineHeight: 1,
  whiteSpace: 'nowrap',
});

export const navList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

export const navItemWrapper = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const navIndicator = style({
  width: '3px',
  height: '24px',
  borderRadius: '0 2px 2px 0',
  flexShrink: 0,
  backgroundColor: 'transparent',
  marginRight: '5px',
});

export const navIndicatorActive = style({
  backgroundColor: vars.color.brand.primary,
});

export const navItemContent = recipe({
  base: {
    '@media': { [media.tablet]: { minHeight: '44px' } },
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    height: '40px',
    flex: 1,
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '9px',
    paddingBottom: '9px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: vars.typography.fontFamily,
    fontSize: vars.typography.fontSize.base,
    fontWeight: vars.typography.fontWeight.bold,
    textAlign: 'left',
    transition: 'background-color 0.15s ease, color 0.15s ease',
    selectors: {
      '&:hover': {
        backgroundColor: vars.color.neutral.n100,
      },
    },
  },
  variants: {
    active: {
      true: {
        backgroundColor: vars.color.brand.primaryBg,
        color: vars.color.brand.primary,
        selectors: {
          '&:hover': {
            backgroundColor: vars.color.brand.primaryBg,
          },
        },
      },
      false: {
        backgroundColor: 'transparent',
        color: vars.color.neutral.n500,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const navIcon = style({
  width: '22px',
  height: '22px',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'inherit',
});

export const userCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: vars.color.neutral.nSurface,
  height: '52px',
  width: '100%',
  paddingLeft: '12px',
  paddingRight: '12px',
  borderRadius: '12px',
  flexShrink: 0,
});

export const avatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundImage: `linear-gradient(135deg, ${vars.color.brand.primary} 0%, ${vars.color.brand.primaryLight} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.white,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  flexShrink: 0,
});

export const userInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
  minWidth: 0,
});

export const userNameStyle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  color: vars.color.neutral.n900,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const userEmailStyle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '11px',
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n400,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const logoutButton = style({
  '@media': { [media.tablet]: { width: '44px', height: '44px' } },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  marginLeft: 'auto',
  flexShrink: 0,
  background: 'none',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  color: vars.color.neutral.n400,
  padding: 0,
  ':hover': {
    color: vars.color.neutral.n600,
    backgroundColor: vars.color.neutral.n100,
  },
});
