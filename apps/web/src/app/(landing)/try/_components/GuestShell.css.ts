import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const account = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
  padding: '14px 12px',
  borderRadius: '12px',
  backgroundColor: vars.color.neutral.nSurface,
  flexShrink: 0,
});

export const accountText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xxs,
  color: vars.color.neutral.n600,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
});

export const accountActions = style({
  display: 'flex',
  gap: '8px',
});

export const accountButton = style({
  flex: 1,
  minHeight: '40px',
});
