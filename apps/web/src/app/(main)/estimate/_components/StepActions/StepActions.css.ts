import { media } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  '@media': {
    [media.mobile]: { gap: '12px', height: 'auto', flexWrap: 'wrap' },
  },
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '45px',
  flexShrink: 0,
});

export const resetIconWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const actionButton = style({
  width: '189px',
  '@media': { [media.mobile]: { flex: '1 1 120px', minHeight: '44px' } },
});
