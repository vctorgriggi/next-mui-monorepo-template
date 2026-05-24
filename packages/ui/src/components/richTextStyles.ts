import type { Theme } from '@mui/material/styles';

const MONOSPACE_FONT =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

/**
 * Shared styles consumed by `RichTextView` (read mode) and by the
 * editable content inside `RichTextEditor` (`.ProseMirror`). Maps the
 * HTML tags produced by TipTap to MUI theme typography and re-asserts
 * a few rules Tailwind's preflight zeroes out (list-style, strong
 * weight, etc).
 */
export function richTextSx(theme: Theme) {
  return {
    '& p': {
      margin: 0,
      marginBottom: theme.spacing(1),
      ...theme.typography.body2,
      '&:last-child': { marginBottom: 0 },
    },
    '& h2': {
      ...theme.typography.subtitle1,
      fontWeight: 600,
      margin: `${theme.spacing(1.5)} 0 ${theme.spacing(0.5)}`,
      '&:first-of-type': { marginTop: 0 },
    },
    '& h3': {
      ...theme.typography.subtitle2,
      fontWeight: 600,
      margin: `${theme.spacing(1)} 0 ${theme.spacing(0.5)}`,
      '&:first-of-type': { marginTop: 0 },
    },
    '& ul': {
      margin: `${theme.spacing(0.5)} 0`,
      paddingLeft: theme.spacing(3),
      listStyleType: 'disc',
    },
    '& ol': {
      margin: `${theme.spacing(0.5)} 0`,
      paddingLeft: theme.spacing(3),
      listStyleType: 'decimal',
    },
    '& li': {
      ...theme.typography.body2,
      marginBottom: theme.spacing(0.25),
    },
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      textUnderlineOffset: 2,
      '&:hover': { textDecoration: 'none' },
    },
    '& code': {
      fontFamily: MONOSPACE_FONT,
      fontSize: '0.85em',
      padding: '0.15em 0.4em',
      borderRadius: theme.shape.borderRadius,
      bgcolor: theme.palette.action.hover,
    },
    '& pre': {
      fontFamily: MONOSPACE_FONT,
      fontSize: '0.85em',
      padding: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadius,
      bgcolor: theme.palette.action.hover,
      overflow: 'auto',
      margin: `${theme.spacing(1)} 0`,
      '& code': { padding: 0, bgcolor: 'transparent' },
    },
    '& blockquote': {
      margin: `${theme.spacing(1)} 0`,
      paddingLeft: theme.spacing(2),
      borderLeft: `3px solid ${theme.palette.divider}`,
      color: theme.palette.text.secondary,
    },
    '& strong, & b': { fontWeight: 700 },
    '& em, & i': { fontStyle: 'italic' },
    '& s, & del': { textDecoration: 'line-through' },
    '& u': { textDecoration: 'underline' },
  };
}
