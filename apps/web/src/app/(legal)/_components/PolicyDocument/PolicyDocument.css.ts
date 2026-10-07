import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const shell = style({
  fontFamily: vars.typography.fontFamily,
  minHeight: '100vh',
  backgroundColor: vars.color.white,
  color: vars.color.neutral.n700,
  overflowWrap: 'anywhere',
});
export const topbar = style({
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '24px 32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
  '@media': { [media.mobile]: { padding: '16px 20px', flexWrap: 'wrap', gap: '12px' } },
});
export const home = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: '44px',
  fontSize: '13px',
  color: vars.color.neutral.n600,
  textDecoration: 'none',
});
export const tabs = style({ display: 'flex', flexWrap: 'wrap', gap: '8px' });
export const tab = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  padding: '8px 12px',
  fontSize: '14px',
  lineHeight: 1.5,
  borderRadius: '10px',
  textDecoration: 'none',
  color: vars.color.neutral.n600,
  selectors: {
    '&[aria-current="page"]': {
      color: vars.color.brand.secondary,
      backgroundColor: vars.color.neutral.n100,
      fontWeight: 700,
    },
  },
  ':hover': { backgroundColor: vars.color.neutral.n100 },
});
export const main = style({
  width: '100%',
  maxWidth: '1120px',
  margin: '0 auto',
  padding: '64px 32px 40px',
  '@media': { [media.mobile]: { padding: '36px 20px 20px' } },
});
export const intro = style({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' });
export const badge = style({
  padding: '6px 10px',
  backgroundColor: vars.color.neutral.n100,
  color: vars.color.brand.secondary,
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 700,
});
export const title = style({
  fontSize: '38px',
  fontWeight: 700,
  lineHeight: 1.35,
  letterSpacing: '-1px',
  color: vars.color.neutral.n900,
  '@media': { [media.mobile]: { fontSize: '30px' } },
});
export const description = style({ fontSize: '16px', lineHeight: 1.8, color: vars.color.neutral.n600 });
export const meta = style({ fontSize: '13px', lineHeight: 1.8, color: vars.color.neutral.n500 });
export const draftNotice = style({
  marginTop: '28px',
  padding: '20px 24px',
  border: '1px solid #eed9a8',
  borderRadius: '12px',
  backgroundColor: '#fffbf2',
  color: '#72551d',
  fontSize: '14px',
  lineHeight: 1.8,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  '@media': { [media.mobile]: { padding: '16px' } },
});
export const documentGrid = style({
  display: 'grid',
  gridTemplateColumns: '224px minmax(0, 1fr)',
  gap: '56px',
  marginTop: '48px',
  alignItems: 'start',
  '@media': {
    [media.tablet]: { gridTemplateColumns: '192px minmax(0, 1fr)', gap: '28px' },
    [media.mobile]: { gridTemplateColumns: 'minmax(0, 1fr)', gap: '32px', marginTop: '32px' },
  },
});
export const sidebar = style({ position: 'sticky', top: '24px', '@media': { [media.mobile]: { position: 'static' } } });
export const tocTitle = style({
  fontSize: '13px',
  fontWeight: 700,
  color: vars.color.neutral.n500,
  marginBottom: '12px',
});
export const toc = style({ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' });
export const tocLink = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  padding: '8px 0',
  color: vars.color.neutral.n600,
  fontSize: '14px',
  lineHeight: 1.6,
  textDecoration: 'none',
  ':hover': { color: vars.color.brand.secondary },
});
export const article = style({ minWidth: 0, fontSize: '15px', lineHeight: 1.9 });
export const section = style({
  scrollMarginTop: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingBottom: '36px',
  marginBottom: '36px',
  borderBottom: `1px solid ${vars.color.neutral.n200}`,
});
export const sectionTitle = style({
  display: 'flex',
  gap: '12px',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: 1.6,
  color: vars.color.neutral.n900,
});
export const sectionNumber = style({ color: vars.color.brand.secondary, fontSize: '15px', paddingTop: '4px' });
export const groups = style({ display: 'flex', flexDirection: 'column', gap: '12px' });
export const group = style({ backgroundColor: vars.color.neutral.n100, padding: '18px 20px', borderRadius: '12px' });
export const groupTitle = style({ fontWeight: 700, marginBottom: '8px' });
export const groupDescription = style({ margin: 0, color: vars.color.neutral.n700 });
export const items = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  paddingLeft: '22px',
  listStyle: 'disc',
});
export const pending = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '14px 18px',
  borderLeft: '3px solid #d7b76c',
  backgroundColor: '#fffbf2',
  fontSize: '13px',
  color: '#72551d',
});
export const contact = style({
  padding: '24px',
  borderRadius: '16px',
  backgroundColor: vars.color.neutral.n100,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});
export const contactLink = style({ color: vars.color.brand.secondary, textUnderlineOffset: '4px' });
