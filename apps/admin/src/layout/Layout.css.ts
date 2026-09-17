import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const shell = style({
  '@media': {
    [media.mobile]: { height: 'auto', minHeight: '100dvh', overflow: 'visible', flexDirection: 'column' },
  },
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: vars.color.neutral.nSurface,
});

export const main = style({
  '@media': {
    [media.mobile]: { padding: '24px 16px', overflowY: 'visible' },
  },
  flex: 1,
  padding: vars.space['3xl'],
  minWidth: 0,
  overflowY: 'auto',
});
