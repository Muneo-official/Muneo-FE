import { media } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  '@media': {
    [media.mobile]: { paddingTop: '104px' },
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  paddingTop: '72px',
});
