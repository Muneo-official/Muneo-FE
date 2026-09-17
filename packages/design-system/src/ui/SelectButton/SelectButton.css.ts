import { recipe } from '@vanilla-extract/recipes';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';
import { typographyStyles } from '../../styles/typography';

export const selectButtonRecipe = recipe({
  base: {
    '@media': { [media.mobile]: { minHeight: '44px' } },
    ...typographyStyles.label,
    fontWeight: vars.typography.fontWeight.bold,
    fontFamily: vars.typography.fontFamily,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '54px',
    paddingTop: vars.space.md,
    paddingBottom: vars.space.md,
    paddingLeft: vars.space.lg,
    paddingRight: vars.space.lg,
    borderRadius: vars.radius.md,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
    selectors: {
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: '#8F49E9',
        color: vars.color.white,
        border: '1.5px solid transparent',
      },
      false: {
        backgroundColor: vars.color.white,
        color: vars.color.neutral.n700,
        border: `1.5px solid ${vars.color.neutral.n200}`,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});
