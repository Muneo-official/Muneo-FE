import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
});

export const chevron = style({
  fontSize: '12px',
  color: vars.color.neutral.n700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  transformOrigin: 'center',
});

export const chevronClosed = style({
  transform: 'rotate(-90deg)',
});

export const sectionName = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  letterSpacing: '-0.16px',
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const collapseWrapper = style({
  display: 'grid',
  gridTemplateRows: '1fr',
  transition: 'grid-template-rows 0.3s ease',
  overflow: 'hidden',
});

export const collapseWrapperClosed = style({
  gridTemplateRows: '0fr',
});

export const itemList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minHeight: 0,
  overflow: 'hidden',
});

export const divider = style({
  height: '1px',
  backgroundColor: vars.color.neutral.n200,
  marginTop: '4px',
});

export const lockedMeta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  marginLeft: 'auto',
  color: vars.color.neutral.n500,
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.medium,
  whiteSpace: 'nowrap',
});

export const lockedItems = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});
