import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const panel = style({
  '@media': {
    [media.mobile]: { padding: '36px 20px', marginTop: '8px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  maxWidth: '480px',
  margin: '48px auto 0',
  padding: '44px 32px',
  borderRadius: '20px',
  border: `1px solid ${vars.color.neutral.n200}`,
  backgroundColor: vars.color.white,
  textAlign: 'center',
});

export const copy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const title = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.lg,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 1.4,
  wordBreak: 'keep-all',
  textWrap: 'balance',
});

export const description = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n600,
  lineHeight: 1.7,
  wordBreak: 'keep-all',
  textWrap: 'balance',
});

export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '12px',
});
