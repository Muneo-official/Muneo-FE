import { media } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  '@media': {
    [media.mobile]: { minHeight: '100dvh', padding: '16px', alignItems: 'safe center' },
  },
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6',
});
