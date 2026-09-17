import { globalStyle, style } from '@vanilla-extract/css';
import { media } from '../../styles/responsive';
import { vars } from '../../styles/tokens.css';
import { typographyStyles } from '../../styles/typography';

export const wrapper = style({
  '@media': {
    [media.mobile]: { maxWidth: '100%' },
  },
  position: 'relative',
  display: 'inline-block',
});

export const trigger = style({
  '@media': {
    [media.mobile]: { width: '100%', minHeight: '44px', padding: '11px 8px' },
  },
  ...typographyStyles.labelSm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n500,
  fontFamily: vars.typography.fontFamily,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '10px',
  paddingTop: '11px',
  paddingBottom: '11px',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: vars.color.brand.primary,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const triggerOpen = style({
  borderColor: vars.color.brand.primary,
});

export const panel = style({
  '@media': {
    [media.mobile]: { maxWidth: 'calc(100vw - 64px)' },
  },
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: 10,
  userSelect: 'none',
});

// 브랜드 색상 오버라이드만 최소로 적용
globalStyle(`${panel} .react-datepicker`, {
  fontFamily: vars.typography.fontFamily,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
});

globalStyle(`${panel} .react-datepicker__header`, {
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.neutral.n100}`,
  borderRadius: '10px 10px 0 0',
});

globalStyle(`${panel} .react-datepicker__current-month`, {
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n900,
});

globalStyle(`${panel} .react-datepicker__day-name`, {
  color: vars.color.neutral.n400,
  fontFamily: vars.typography.fontFamily,
});

globalStyle(`${panel} .react-datepicker__day`, {
  color: vars.color.neutral.n900,
  fontFamily: vars.typography.fontFamily,
  borderRadius: '50%',
});

globalStyle(`${panel} .react-datepicker__day:hover`, {
  backgroundColor: vars.color.neutral.n100,
  borderRadius: '50%',
});

globalStyle(`${panel} .react-datepicker__day--today`, {
  fontWeight: vars.typography.fontWeight.semiBold,
  color: vars.color.brand.primary,
  backgroundColor: 'transparent',
});

globalStyle(`${panel} .react-datepicker__day--in-range`, {
  backgroundColor: vars.color.brand.primaryBg,
  color: vars.color.neutral.n900,
  borderRadius: 0,
});

globalStyle(`${panel} .react-datepicker__day--in-selecting-range`, {
  backgroundColor: vars.color.brand.primaryBg,
  borderRadius: 0,
});

globalStyle(
  `${panel} .react-datepicker__day--selected,
   ${panel} .react-datepicker__day--range-start,
   ${panel} .react-datepicker__day--range-end`,
  {
    backgroundColor: vars.color.brand.primary,
    color: vars.color.white,
    borderRadius: '50%',
  }
);

globalStyle(
  `${panel} .react-datepicker__day--selected:hover,
   ${panel} .react-datepicker__day--range-start:hover,
   ${panel} .react-datepicker__day--range-end:hover`,
  {
    backgroundColor: vars.color.brand.primary,
  }
);

globalStyle(
  `${panel} .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--selected):not(.react-datepicker__day--range-start):not(.react-datepicker__day--range-end)`,
  {
    backgroundColor: 'transparent',
    color: vars.color.neutral.n900,
  }
);

globalStyle(`${panel} .react-datepicker__navigation-icon::before`, {
  borderColor: vars.color.neutral.n500,
});

globalStyle(`${panel} .react-datepicker__navigation:hover *::before`, {
  borderColor: vars.color.neutral.n900,
});
