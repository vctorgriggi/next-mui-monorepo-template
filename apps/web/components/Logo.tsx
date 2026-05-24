import type { SVGProps } from 'react';

/**
 * Inline logo SVG.
 *
 * Uses `currentColor` for the fill, so it inherits the `color` from the
 * surrounding context. Render inside an element with
 * `color: 'text.primary'` (or any theme-aware token) and the logo flips
 * with the color mode automatically — no `filter: invert(1)` hacks.
 *
 * Replace the contents (rect + text) with your real logo when you fork.
 */
export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 204 56"
      fill="none"
      aria-label="Logo"
      role="img"
      {...props}
    >
      <rect x="8" y="14" width="28" height="28" rx="6" fill="currentColor" />
      <text
        x="48"
        y="36"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="20"
        fontWeight="600"
        fill="currentColor"
      >
        Your Logo
      </text>
    </svg>
  );
}
