import { media } from '@muneo/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const page = style({
  '@media': {
    [media.compact]: { padding: '32px 32px 100px' },
    [media.mobile]: { padding: '28px 16px 100px', minHeight: 'calc(100dvh - 64px)' },
  },
  backgroundColor: '#f8f9fc',
  minHeight: '100vh',
  padding: '46px 60px 100px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '1280px',
  margin: '0 auto',
});

export const greetingSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

const skeletonBase = style({
  maxWidth: '100%',
  backgroundColor: '#e5e7eb',
  borderRadius: '8px',
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

export const skeletonTitle = style([
  skeletonBase,
  {
    width: '280px',
    height: '32px',
  },
]);

export const skeletonSubtitle = style([
  skeletonBase,
  {
    width: '360px',
    height: '20px',
  },
]);

export const summaryRow = style({
  '@media': {
    [media.compact]: { gap: '12px' },
    [media.mobile]: { flexDirection: 'column' },
  },
  display: 'flex',
  gap: '22px',
  width: '100%',
});

export const skeletonCard = style([
  skeletonBase,
  {
    flex: 1,
    height: '88px',
    borderRadius: '12px',
  },
]);

export const skeletonTable = style([
  skeletonBase,
  {
    width: '100%',
    height: '420px',
    borderRadius: '16px',
    marginTop: '10px',
  },
]);
