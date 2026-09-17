import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const filterBar = style({
  '@media': {
    [media.compact]: { height: 'auto', padding: '16px', gap: '12px', flexWrap: 'wrap' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.08)',
  padding: '0 16px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

export const filterLeft = style({
  '@media': {
    [media.compact]: { flexWrap: 'wrap', gap: '12px' },
    [media.mobile]: { width: '100%', flexDirection: 'column', alignItems: 'stretch' },
  },
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
});

export const dropdown = style({
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  width: '155px',
});

export const searchButton = style({
  '@media': {
    [media.mobile]: { width: '100%' },
  },
  border: `1.5px solid ${vars.color.brand.primary}`,
  borderRadius: '25px',
  padding: '9px 16px',
  minWidth: '100px',
});
