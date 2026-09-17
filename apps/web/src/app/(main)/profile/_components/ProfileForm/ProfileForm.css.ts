import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
  width: '100%',
});

export const actionsRow = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap', gap: '16px' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  width: '100%',
});

export const submitButton = style({
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  width: '200px',
});

export const errorMessage = style({
  alignSelf: 'flex-start',
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: '#ef4444',
  margin: 0,
});

export const socialField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  width: '100%',
});

export const socialFieldLabel = style({
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  margin: 0,
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: vars.color.neutral.n600,
  letterSpacing: '-0.112px',
});

export const socialBadge = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  width: '100%',
  backgroundColor: '#e6e6e6',
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: vars.radius.base,
  padding: '10px 16px',
});

export const socialBadgeIcon = style({
  width: '18px',
  height: '17px',
  flexShrink: 0,
});

export const socialBadgeText = style({
  '@media': {
    [media.mobile]: { overflowWrap: 'anywhere', minWidth: 0 },
  },
  fontFamily: vars.typography.fontFamily,
  lineHeight: 'normal',
  fontSize: vars.typography.fontSize.sm,
  fontWeight: vars.typography.fontWeight.regular,
  color: 'rgba(10, 10, 10, 0.5)',
});
