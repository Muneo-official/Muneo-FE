import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const sidebar = style({
  '@media': {
    [media.mobile]: {
      width: '100%',
      height: 'auto',
      padding: '16px',
      gap: '12px',
      borderRight: 'none',
      borderBottom: '1px solid #e5e7eb',
    },
  },
  width: vars.layout.sidebarWidth,
  height: '100%',
  backgroundColor: vars.color.white,
  borderRight: `1px solid ${vars.color.neutral.n200}`,
  padding: `${vars.space['2xl']} ${vars.space.lg}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  flexShrink: 0,
  overflowY: 'auto',
});

export const brand = style({
  fontFamily: vars.typography.fontFamilyDisplay,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.brand.primary,
  padding: `0 ${vars.space.sm}`,
  letterSpacing: vars.typography.letterSpacing.sm,
});

export const navList = style({
  '@media': {
    [media.mobile]: { flexDirection: 'row' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  flex: 1,
  listStyle: 'none',
});

export const navItem = style({
  display: 'block',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderRadius: vars.radius.sm,
  color: vars.color.neutral.n600,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.medium,
  textDecoration: 'none',
  transition: 'background-color 0.15s, color 0.15s',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.neutral.n100,
      color: vars.color.neutral.n900,
    },
  },
});

export const navItemActive = style({
  backgroundColor: vars.color.brand.primaryBg,
  color: vars.color.brand.primary,
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brand.primaryBg,
      color: vars.color.brand.primary,
    },
  },
});

export const userBlock = style({
  '@media': {
    [media.mobile]: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '4px 12px' },
  },
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.md,
  borderRadius: vars.radius.sm,
  backgroundColor: vars.color.neutral.nSurface,
});

export const userName = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.semiBold,
  color: vars.color.neutral.n900,
});

export const userEmail = style({
  '@media': {
    [media.mobile]: { gridColumn: 1 },
  },
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n500,
  wordBreak: 'break-all',
});

export const logoutBtn = style({
  '@media': {
    [media.mobile]: { gridColumn: 2, gridRow: '1 / 3', minHeight: '44px', marginTop: 0 },
  },
  marginTop: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n600,
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n300}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.neutral.n100,
    },
  },
});
