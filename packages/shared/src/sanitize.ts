import sanitizeHtml from 'sanitize-html';

/*
 * sanitizeRichTextHtml — sanitizes the HTML produced by `RichTextEditor`
 * (TipTap) before rendering it via `dangerouslySetInnerHTML`. Safe on
 * both the server (reading stored content) and the client (`RichTextView`)
 * because `sanitize-html` is pure JS with no DOM dependency (no jsdom).
 *
 * The allow-list mirrors the extensions enabled in `RichTextEditor`.
 * Adding a new extension (tables, task lists, etc.) requires whitelisting
 * the corresponding tags here, or the content gets silently stripped.
 */

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  's',
  'del',
  'u',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'a',
  'code',
  'pre',
  'blockquote',
];

export function sanitizeRichTextHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  });
}
