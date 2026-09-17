import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export {
  modal,
  closeButton,
  upper,
  logoSection,
  logoButton,
  tagline,
  fullWidth,
  footerRow,
  footerDivider,
} from '../authModal.css';

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space['3xl'],
  width: '340px',
  maxWidth: '100%',
});

export const formSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  width: '100%',
});

export const actionSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
  width: '100%',
});

export const socialAccountField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%',
});

export const socialAccountLabel = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '14px',
  color: '#4b5563',
  letterSpacing: '-0.112px',
});

export const socialAccountBox = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  padding: '10px 16px',
  borderRadius: '10px',
  border: '0.935px solid #e5e7eb',
  backgroundColor: '#e6e6e6',
});

export const socialAccountIcon = style({
  width: '18px',
  height: '16.8px',
  flexShrink: 0,
});

export const socialAccountText = style({
  '@media': {
    [media.mobile]: { overflowWrap: 'anywhere', minWidth: 0 },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '14px',
  color: 'rgba(10, 10, 10, 0.5)',
});

export const loginText = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.medium,
  color: vars.color.neutral.n600,
  opacity: 0.9,
  letterSpacing: '-0.096px',
  whiteSpace: 'nowrap',
});

export const loginLink = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.brand.secondary,
  opacity: 0.9,
  letterSpacing: '-0.096px',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
});
