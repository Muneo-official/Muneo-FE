import { media, vars } from '@muneo/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  minHeight: '100vh',
  // 한국어가 음절 중간에서 끊기지 않게 하고, 마지막 줄에 한 단어만 남는 줄바꿈을 피한다.
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
  textWrap: 'pretty',
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
