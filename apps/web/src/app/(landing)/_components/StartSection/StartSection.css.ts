import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const section = style({
  padding: '16px 32px 80px',
  '@media': { [media.mobile]: { padding: '0 20px 48px' } },
});
export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '56px 32px',
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '24px',
  background: 'linear-gradient(130deg, #f1edff 0%, #faf9ff 65%, #f0f3ff 100%)',
  textAlign: 'center',
  '@media': { [media.mobile]: { padding: '36px 20px', gap: '16px' } },
});
export const eyebrow = style({ fontSize: '14px', fontWeight: 600, color: vars.color.brand.secondary });
export const title = style({
  fontSize: '32px',
  fontWeight: 700,
  color: vars.color.neutral.n900,
  lineHeight: 1.4,
  wordBreak: 'keep-all',
  '@media': { [media.mobile]: { fontSize: '26px' } },
});
export const description = style({
  color: vars.color.neutral.n600,
  fontSize: '16px',
  lineHeight: 1.7,
  wordBreak: 'keep-all',
  marginBottom: '12px',
});
export const loginNote = style({ fontSize: '13px', lineHeight: 1.7, color: vars.color.neutral.n600 });
