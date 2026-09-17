import { media, vars } from '@muneo/design-system';
import { style } from '@vanilla-extract/css';

export const card = style({
  '@media': {
    [media.compact]: { width: '100%' },
    [media.mobile]: { padding: '24px 16px' },
  },
  backgroundColor: vars.color.white,
  borderRadius: '15px',
  width: '600px',
  flexShrink: 0,
  padding: '28px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  overflow: 'hidden',
});

export const sectionHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

export const sectionTitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.md,
  fontWeight: vars.typography.fontWeight.bold,
  color: vars.color.neutral.n900,
  lineHeight: 'normal',
});

export const sectionSubtitle = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const dropzone = style({
  '@media': {
    [media.mobile]: { height: 'auto', minHeight: '180px', padding: '20px 12px' },
  },
  border: `2px dashed ${vars.color.brand.primaryLight}`,
  borderRadius: '15px',
  height: '180px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '18px',
  cursor: 'pointer',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.brand.primaryBg,
    },
  },
});

export const dropzoneDragging = style({
  backgroundColor: vars.color.brand.primaryBg,
});

export const dropzoneText = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  textAlign: 'center',
});

export const dropzoneMain = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.sm,
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
});

export const dropzoneSub = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.neutral.n300,
  lineHeight: 'normal',
});

export const uploadArea = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const fileList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const fileItem = style({
  '@media': {
    [media.mobile]: { padding: '12px', gap: '8px' },
  },
  backgroundColor: vars.color.neutral.n100,
  border: `1px solid ${vars.color.neutral.n200}`,
  borderRadius: '15px',
  padding: '14px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const fileInfo = style({
  '@media': {
    [media.mobile]: { minWidth: 0 },
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const fileName = style({
  '@media': {
    [media.mobile]: { whiteSpace: 'normal', overflowWrap: 'anywhere' },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.xs,
  color: vars.color.semantic.info,
  lineHeight: 'normal',
  whiteSpace: 'nowrap',
});

export const fileSize = style({
  fontFamily: vars.typography.fontFamily,
  fontSize: '10px',
  color: vars.color.neutral.n400,
  lineHeight: 'normal',
});

export const fileDelete = style({
  '@media': {
    [media.mobile]: { minHeight: '44px', minWidth: '44px', flexShrink: 0 },
  },
  fontFamily: vars.typography.fontFamily,
  fontSize: '11px',
  color: vars.color.semantic.danger,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
});

export const divider = style({
  height: '1px',
  backgroundColor: vars.color.neutral.n200,
});

export const actions = style({
  '@media': {
    [media.mobile]: { flexWrap: 'wrap' },
  },
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
});

export const actionButton = style({
  flex: '1 0 0',
});
