import DOMPurify from 'isomorphic-dompurify';

// Explicit allowlist matching exactly what the Tiptap extensions in DescriptionSection.tsx can
// emit (Document/Paragraph/Text/Bold/Italic/BulletList/ListItem) — deliberately narrower than
// DOMPurify's broad defaults, since this is rendered via dangerouslySetInnerHTML.
const ALLOWED_TAGS = ['p', 'strong', 'em', 'ul', 'li'];

export function sanitizeDescription(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR: [] });
}
