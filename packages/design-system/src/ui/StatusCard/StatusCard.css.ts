import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';

export const cardRecipe = recipe({
  base: {
    '@media': { [media.compact]: { padding: '12px', minWidth: 0 } },
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '10px',
    borderRadius: '12px',
    boxShadow: '0px 2px 1px 0px rgba(0, 0, 0, 0.08)',
    padding: `${vars.space.lg} 50px ${vars.space.lg} ${vars.space.md}`,
  },
  variants: {
    variant: {
      primary: { backgroundColor: vars.color.brand.primaryBg, color: vars.color.brand.primary },
      success: { backgroundColor: vars.color.semantic.successBg, color: vars.color.semantic.success },
      danger: { backgroundColor: vars.color.semantic.dangerBg, color: vars.color.semantic.danger },
      warning: { backgroundColor: vars.color.semantic.warningBg, color: vars.color.semantic.warning },
      info: { backgroundColor: vars.color.semantic.infoBg, color: vars.color.semantic.info },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const inner = style({
  '@media': { [media.compact]: { minWidth: 0, gap: '8px' } },
  display: 'flex',
  gap: vars.space.md,
  alignItems: 'center',
});

export const iconWrapper = style({
  width: '24px',
  height: '24px',
  flexShrink: 0,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  flex: '1 0 0',
  whiteSpace: 'nowrap',
  minWidth: 0,
  '@media': { [media.compact]: { whiteSpace: 'normal' } },
});

export const label = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  lineHeight: 'normal',
  color: vars.color.neutral.n500,
});

export const labelHighlight = style([
  label,
  {
    fontSize: vars.typography.fontSize.xs,
  },
]);

export const value = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.extraBold,
  lineHeight: 'normal',
  letterSpacing: '-0.2px',
  color: vars.color.neutral.n900,
  opacity: 0.8,
});

export const valueHighlight = style([
  value,
  {
    fontSize: vars.typography.fontSize.xl,
    letterSpacing: '-0.24px',
  },
]);

export const description = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xxs,
  fontWeight: vars.typography.fontWeight.regular,
  lineHeight: 'normal',
  color: vars.color.neutral.n500,
});
