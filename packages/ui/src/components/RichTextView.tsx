'use client';

import Box from '@mui/material/Box';
import { sanitizeRichTextHtml } from '@template/shared/sanitize';

import { richTextSx } from './richTextStyles';

interface RichTextViewProps {
  html: string;
}

/**
 * Renders HTML produced by `RichTextEditor` (TipTap), with sanitization
 * and typography tied to the MUI theme. Use this whenever you display
 * stored rich content — never render raw HTML directly.
 */
export default function RichTextView({ html }: RichTextViewProps) {
  return (
    <Box
      sx={richTextSx}
      dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(html) }}
    />
  );
}
