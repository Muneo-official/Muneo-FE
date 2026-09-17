import { media, vars } from '@muneo/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  minHeight: '100vh',
});

export const main = style({
  '@media': {
    [media.tablet]: { marginLeft: 0, paddingTop: '64px' },
  },
  marginLeft: vars.layout.sidebarWidth,
  flex: 1,
  minWidth: 0,
  overflowX: 'hidden',
});

export const sidebar = style({
  viewTransitionName: 'sidebar',
});

globalStyle(
  [
    '::view-transition-old(sidebar)',
    '::view-transition-new(sidebar)',
    '::view-transition-old(floating-chat)',
    '::view-transition-new(floating-chat)',
  ].join(', '),
  {
    animation: 'none',
  }
);
