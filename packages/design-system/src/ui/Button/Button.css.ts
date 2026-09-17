import { recipe } from '@vanilla-extract/recipes';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';
import { typographyStyles } from '../../styles/typography';

export const buttonRecipe = recipe({
  base: {
    '@media': { [media.mobile]: { minHeight: '44px' } },
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: vars.typography.fontFamily,
    fontWeight: vars.typography.fontWeight.semiBold,
    borderRadius: vars.radius.sm,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, filter 0.15s ease',
    selectors: {
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      sm: {
        ...typographyStyles.label,
        fontWeight: vars.typography.fontWeight.semiBold,
        padding: `${vars.space.xs} ${vars.space.sm}`,
        gap: vars.space.xs,
      },
      md: {
        ...typographyStyles.h4,
        fontSize: vars.typography.fontSize.base,
        padding: `${vars.space.sm} ${vars.space.lg}`,
        gap: vars.space.sm,
      },
      lg: {
        ...typographyStyles.h3,
        padding: `${vars.space.sm} ${vars.space['2xl']}`,
        gap: vars.space.sm,
      },
    },
    variant: {
      primary: {
        backgroundColor: vars.color.brand.secondary,
        color: vars.color.white,
        border: `1px solid ${vars.color.neutral.n200}`,
        borderRadius: '12px',
        selectors: {
          '&:hover:not(:disabled)': {
            filter: 'brightness(0.9)',
          },
          '&:active:not(:disabled)': {
            filter: 'brightness(0.8)',
          },
        },
      },
      secondary: {
        backgroundColor: vars.color.neutral.nSurface,
        color: vars.color.neutral.n900,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: vars.color.neutral.n100,
          },
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: vars.color.brand.primary,
        border: `1px solid ${vars.color.neutral.n200}`,
        selectors: {
          '&:hover:not(:disabled)': {
            borderColor: vars.color.brand.primary,
            backgroundColor: vars.color.brand.primaryBg,
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: vars.color.neutral.n900,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: vars.color.neutral.n100,
          },
        },
      },
      outlineSecondary: {
        backgroundColor: vars.color.white,
        color: vars.color.brand.secondary,
        border: `1px solid ${vars.color.neutral.n200}`,
        borderRadius: '12px',
        selectors: {
          '&:hover:not(:disabled)': {
            borderColor: vars.color.brand.secondary,
          },
          '&:active:not(:disabled)': {
            filter: 'brightness(0.95)',
          },
        },
      },
      outlineSecondaryStrong: {
        backgroundColor: vars.color.white,
        color: vars.color.brand.secondary,
        border: `1.5px solid ${vars.color.brand.secondary}`,
        borderRadius: '12px',
        selectors: {
          '&:hover:not(:disabled)': {
            filter: 'brightness(0.9)',
          },
          '&:active:not(:disabled)': {
            filter: 'brightness(0.8)',
          },
        },
      },
      gradient: {
        ...typographyStyles.label,
        fontWeight: vars.typography.fontWeight.bold,
        lineHeight: 'normal',
        gap: '10px',
        background: `linear-gradient(to right, ${vars.color.brand.primary}, ${vars.color.brand.primaryLight})`,
        border: `1px solid ${vars.color.neutral.n200}`,
        borderRadius: '12px',
        color: vars.color.white,
        padding: `${vars.space.md} ${vars.space.lg}`,
        selectors: {
          '&:hover:not(:disabled)': {
            filter: 'brightness(0.9)',
          },
          '&:active:not(:disabled)': {
            filter: 'brightness(0.8)',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
