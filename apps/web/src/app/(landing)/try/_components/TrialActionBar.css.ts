import { media, vars } from '@muneo/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const bar = style({
  '@media': {
    [media.mobile]: { flexDirection: 'column', alignItems: 'stretch', gap: '16px' },
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  width: '100%',
  paddingTop: '20px',
  borderTop: `1px solid ${vars.color.neutral.n200}`,
});

export const copy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const title = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 1.5,
});

export const text = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '13px',
  color: vars.color.neutral.n500,
  lineHeight: 1.6,
});

export const actions = style({
  '@media': {
    // 좁은 화면에서는 주 버튼을 위로 올리고 두 버튼을 꽉 채운다.
    [media.mobile]: { flexDirection: 'column-reverse', gap: '8px' },
  },
  display: 'flex',
  flexShrink: 0,
  gap: '12px',
});

globalStyle(`${actions} > *`, {
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  whiteSpace: 'nowrap',
});
