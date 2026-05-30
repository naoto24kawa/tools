import createDOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({ gfm: true });

function getPurify() {
  return createDOMPurify(window);
}

export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  const raw = marked.parse(markdown) as string;
  return getPurify().sanitize(raw);
}

export function convertMarkdownToFragment(markdown: string): DocumentFragment {
  const raw = markdown ? (marked.parse(markdown) as string) : '';
  return getPurify().sanitize(raw, { RETURN_DOM_FRAGMENT: true }) as DocumentFragment;
}
