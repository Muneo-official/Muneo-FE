import { vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const account = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  padding: '16px 14px 14px',
  borderRadius: '12px',
  backgroundColor: vars.color.neutral.nSurface,
  flexShrink: 0,
});

export const accountText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n700,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
  textWrap: 'balance',
});

export const accountActions = style({
  display: 'flex',
  gap: '8px',
});

export const accountButton = style({
  flex: 1,
  minHeight: '40px',
});
