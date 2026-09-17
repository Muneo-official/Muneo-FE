import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '13px',
});

export const sectionTitle = style({
  '@media': {
    [media.mobile]: { fontSize: '26px', whiteSpace: 'normal', wordBreak: 'keep-all' },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.extraBold,
  fontSize: vars.typography.fontSize['3xl'],
  lineHeight: 'normal',
  color: vars.color.neutral.n900,
  opacity: 0.9,
  textAlign: 'center',
  letterSpacing: '-0.28px',
  whiteSpace: 'nowrap',
});

export const sectionDivider = style({
  width: '72px',
  height: '0.8px',
  opacity: 0.7,
  backgroundColor: vars.color.neutral.n500,
  flexShrink: 0,
});

export const sectionSubtitle = style({
  '@media': {
    [media.mobile]: { fontSize: '15px', lineHeight: 1.6, whiteSpace: 'normal', wordBreak: 'keep-all' },
  },
  fontFamily: vars.typography.fontFamily,
  fontWeight: vars.typography.fontWeight.regular,
  fontSize: vars.typography.fontSize.md,
  lineHeight: 'normal',
  color: vars.color.neutral.n500,
  textAlign: 'center',
  letterSpacing: '-0.16px',
  whiteSpace: 'nowrap',
});
