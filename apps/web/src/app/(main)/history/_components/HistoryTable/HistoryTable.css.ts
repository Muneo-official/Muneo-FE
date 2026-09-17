import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [media.mobile]: { padding: '20px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '16px',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.11)',
  padding: '21px 24px 40px',
  width: '100%',
});

export const table = style({
  '@media': {
    [media.mobile]: { minWidth: '640px' },
  },
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
});

export const colId = style({ width: '6%' });
export const colDate = style({ width: '12%' });
export const colAnalysisType = style({ width: '14%' });
export const colConstructionType = style({ width: '38%' });
export const colRisk = style({ width: '17%' });
export const colStatus = style({ width: '13%' });

export const thead = style({
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
});

export const th = style({
  padding: '12px 16px 12px 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n400,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

export const td = style({
  padding: '18px 16px 18px 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.regular,
  color: '#374151',
  verticalAlign: 'middle',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tdAnalysisType = style([
  td,
  {
    fontSize: vars.typography.fontSize.xs,
    fontWeight: vars.typography.fontWeight.semiBold,
    letterSpacing: '-0.096px',
  },
]);

export const riskDanger = style({ color: '#ef4444', fontSize: '12px' });
export const riskWarning = style({ color: '#f59e0b', fontSize: '12px' });
export const riskNone = style({ color: '#9ca3af' });
export const statusComplete = style({ color: '#10b981' });
export const statusInProgress = style({ color: '#f59e0b' });
export const statusPending = style({ color: '#9ca3af' });

export const emptyRow = style({
  textAlign: 'center',
  padding: '48px 0',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: vars.color.neutral.n400,
});

export const tableScroll = style({
  width: '100%',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
});
