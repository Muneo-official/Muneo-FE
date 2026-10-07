import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const body = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n900,
  lineHeight: 1.6,
  minWidth: 0,
});
export const controls = style({ display: 'flex', flexWrap: 'wrap', gap: vars.space.sm, alignItems: 'center' });
export const button = style({
  font: 'inherit',
  cursor: 'pointer',
  border: `1px solid ${vars.color.neutral.n200}`,
  background: vars.color.white,
  color: vars.color.neutral.n700,
  borderRadius: vars.radius.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  selectors: {
    '&[aria-pressed="true"]': { background: vars.color.neutral.n900, color: vars.color.white },
    '&:disabled': { cursor: 'default', opacity: 0.5 },
  },
});
export const muted = style({ color: vars.color.neutral.n600, margin: `${vars.space.sm} 0` });
export const notice = style({
  borderRadius: vars.radius.sm,
  background: vars.color.neutral.nSurface,
  padding: vars.space.md,
  marginTop: vars.space.md,
});
export const error = style([notice, { background: vars.color.semantic.dangerBg }]);
export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  margin: `${vars.space.md} 0`,
});
export const record = style({
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: vars.radius.sm,
  padding: vars.space.md,
  overflowWrap: 'anywhere',
});
export const summary = style({ cursor: 'pointer', fontWeight: vars.typography.fontWeight.medium });
export const metadata = style({ display: 'flex', flexWrap: 'wrap', gap: vars.space.sm, margin: `${vars.space.sm} 0` });
export const fields = style({ margin: 0 });
export const field = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(90px, 1fr) minmax(0, 3fr)',
  gap: vars.space.md,
  padding: `${vars.space.sm} 0`,
  borderBottom: `1px solid ${vars.color.neutral.n100}`,
  '@media': { '(max-width: 600px)': { gridTemplateColumns: 'minmax(0, 1fr)', gap: vars.space.xs } },
});
export const label = style({ color: vars.color.neutral.n600 });
export const value = style({ margin: 0, whiteSpace: 'pre-wrap', minWidth: 0 });
export const json = style({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  fontSize: '12px',
  maxHeight: 500,
  overflow: 'auto',
});
export const comment = style({ whiteSpace: 'pre-wrap', margin: `${vars.space.sm} 0` });
