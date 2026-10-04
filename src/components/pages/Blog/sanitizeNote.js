import DOMPurify from 'dompurify';

// What a Market Note body may contain once it reaches the page. WO-4.38.
//
// The CRM already sanitises contentHtml on the server (WO-1.26, in production
// since 2026-09-29). This is the site's own copy of that rule, so a body that
// ever arrives unsanitised (the CRM's sanitiser was reverted once, on
// 2026-09-28) still cannot run a script on pennjets.com.
//
// The lists match the CRM's purifyBlogHtml (lib/blogFormatting.ts on the CRM's
// main, WO-1.21) exactly: the tags a note uses (p, strong, em, ul, li, br, h2,
// h3, a) plus what the CMS editor can produce and a captioned image. No
// tables: the CRM does not allow them either. `target` is listed because
// DOMPurify drops it by default and every link in a note opens a new tab.
// DOMPurify's own URI rules remove javascript: and other script URLs from
// href and src, and every on* attribute is outside ALLOWED_ATTR.
export const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre',
  'blockquote',
  'img', 'figure', 'figcaption',
  'span',
];

export const ALLOWED_ATTR = ['href', 'target', 'rel', 'title', 'src', 'alt', 'width', 'height', 'class'];

export function sanitizeNoteHtml(html) {
  return DOMPurify.sanitize(html || '', { ALLOWED_TAGS, ALLOWED_ATTR });
}
