import { media, vars } from '@muneo/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [media.mobile]: { padding: '20px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '16px',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.11)',
  padding: '26px 38px 32px 37px',
  width: '100%',
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
});

export const cardTitle = style({
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.bold,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n600,
});

export const cardTitleCount = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '8px',
  padding: '1px 7px',
  borderRadius: '999px',
  backgroundColor: vars.color.brand.primaryBg,
  color: vars.color.brand.primary,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  fontFamily: vars.typography.fontFamily,
});

export const viewAllLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.medium,
  fontFamily: vars.typography.fontFamily,
  color: vars.color.neutral.n400,
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  selectors: {
    '&:hover': {
      color: vars.color.brand.primary,
    },
  },
});

export const table = style({
  '@media': {
    [media.mobile]: { minWidth: '640px' },
  },
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
});

export const colDate = style({ width: '110px' });
export const colType = style({ width: '130px' });
export const colConstruction = style({});
export const colRisk = style({ width: '100px' });
export const colAction = style({ width: '28px' });

export const thead = style({
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
});

export const th = style({
  padding: '10px 12px 10px 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n400,
  textAlign: 'left',
  whiteSpace: 'nowrap',
});

export const tr = style({
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
  cursor: 'pointer',
  transition: 'background-color 0.1s ease',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: vars.color.neutral.nSurface,
    },
  },
});

globalStyle(`${tr}:hover td:last-child`, { opacity: 1 });

export const td = style({
  padding: '13px 12px 13px 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n700,
  verticalAlign: 'middle',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tdDate = style([td, { fontWeight: vars.typography.fontWeight.medium, color: vars.color.neutral.n500 }]);
export const tdType = style([td]);
export const tdConstruction = style([td]);
export const tdRisk = style([td]);

export const tdAction = style([
  td,
  {
    opacity: 0,
    transition: 'opacity 0.1s ease',
    color: vars.color.neutral.n300,
    textAlign: 'right',
    paddingRight: 0,
  },
]);

const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '999px',
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.semiBold,
  whiteSpace: 'nowrap',
});

export const riskDanger = style([
  badge,
  { backgroundColor: vars.color.semantic.dangerBg, color: vars.color.semantic.danger },
]);

export const riskSafe = style([
  badge,
  { backgroundColor: vars.color.semantic.successBg, color: vars.color.semantic.success },
]);

export const riskNone = style({ color: vars.color.neutral.n300, fontSize: vars.typography.fontSize.xs });

export const analysisRisk = style([
  badge,
  { backgroundColor: vars.color.brand.secondaryBg, color: vars.color.brand.secondary },
]);

export const analysisEstimate = style([
  badge,
  { backgroundColor: vars.color.semantic.infoBg, color: vars.color.semantic.info },
]);

export const tableScroll = style({
  width: '100%',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
});
