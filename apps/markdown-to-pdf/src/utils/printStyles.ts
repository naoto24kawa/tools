export type PaperSize = 'A4' | 'Letter';
export type FontSize = 12 | 16 | 20;

export interface PrintOptions {
  paperSize: PaperSize;
  fontSize: FontSize;
}

export function generatePrintCSS({ paperSize, fontSize }: PrintOptions): string {
  return `@media print {
  body > #root > * { display: none !important; }
  #pdf-preview { display: block !important; }

  @page {
    size: ${paperSize};
    margin: 2cm;
  }

  body {
    font-size: ${fontSize}px;
    font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
    color: #000;
    background: #fff;
  }

  h1 { font-size: 2em; border-bottom: 2px solid #333; padding-bottom: 0.25em; margin-top: 1.5em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.2em; margin-top: 1.2em; }
  h3 { font-size: 1.25em; margin-top: 1em; }
  h4, h5, h6 { margin-top: 0.8em; }

  p { margin: 0.75em 0; line-height: 1.7; }

  pre {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    overflow: visible;
    white-space: pre-wrap;
    word-break: break-all;
  }
  pre, code { font-family: 'Courier New', monospace; font-size: 0.875em; }
  code:not(pre code) { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }

  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; }
  th { background: #f5f5f5; font-weight: bold; }

  hr { page-break-after: always; border: none; margin: 0; }

  a { color: #000; text-decoration: underline; }
  img { max-width: 100%; height: auto; }

  blockquote {
    border-left: 4px solid #ccc;
    margin: 1em 0;
    padding: 0.5em 1em;
    color: #555;
    background: #fafafa;
  }

  ul, ol { padding-left: 2em; margin: 0.5em 0; }
  li { margin: 0.25em 0; }
}`;
}
