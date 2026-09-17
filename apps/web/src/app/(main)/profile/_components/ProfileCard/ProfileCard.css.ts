import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [media.tablet]: { maxWidth: '100%' },
    [media.mobile]: { width: '100%', padding: '24px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.11)',
  padding: `${vars.space.xl} ${vars.space['3xl']} 28px`,
  width: '520px',
  overflow: 'hidden',
});

export const inner = style({
  '@media': {
    [media.tablet]: { width: '100%' },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  width: '440px',
});

export const withdrawButton = style({
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  cursor: 'pointer',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: vars.color.neutral.n400,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  selectors: {
    '&:hover': {
      color: '#ef4444',
    },
  },
});
