import sanitizeHtml from 'sanitize-html';

// Explicit allowlist matching exactly what the Tiptap extensions in DescriptionSection.tsx can
// emit (Document/Paragraph/Text/Bold/Italic/BulletList/ListItem) — deliberately narrower than any
// library's broad defaults, since this is rendered via dangerouslySetInnerHTML. Uses sanitize-html
// (htmlparser2-based, no DOM) rather than isomorphic-dompurify — the latter's jsdom dependency
// pulls in an ES-module-only transitive package that Next's serverless build trace can't require()
// at runtime on Vercel (works in local dev, 500s in production — not worth chasing further when
// the actual sanitization need here is this narrow).
const ALLOWED_TAGS = ['p', 'strong', 'em', 'ul', 'li'];

export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, { allowedTags: ALLOWED_TAGS, allowedAttributes: {} });
}
