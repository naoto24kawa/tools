export type ImagePurpose = 'decorative' | 'informational' | 'functional' | 'complex';

export interface AltTextResult {
  purpose: ImagePurpose;
  altAttribute: string;
  explanation: string;
}

export interface QuestionStep {
  id: string;
  question: string;
  options: { label: string; nextStep: string | null; purpose?: ImagePurpose }[];
}

export const decisionTree: QuestionStep[] = [
  {
    id: 'start',
    question: 'Does the image contain text?',
    options: [
      { label: 'Yes', nextStep: 'has-text' },
      { label: 'No', nextStep: 'no-text' },
    ],
  },
  {
    id: 'has-text',
    question: 'Is the text also presented as real text nearby?',
    options: [
      { label: 'Yes - it is decorative', nextStep: null, purpose: 'decorative' },
      { label: 'No - the image conveys the text', nextStep: null, purpose: 'informational' },
    ],
  },
  {
    id: 'no-text',
    question: 'Is the image used as a link or button?',
    options: [
      { label: 'Yes', nextStep: null, purpose: 'functional' },
      { label: 'No', nextStep: 'not-functional' },
    ],
  },
  {
    id: 'not-functional',
    question: 'Does the image contribute meaning to the page?',
    options: [
      { label: 'Yes', nextStep: 'meaningful' },
      { label: 'No - it is purely decorative', nextStep: null, purpose: 'decorative' },
    ],
  },
  {
    id: 'meaningful',
    question: 'Can the meaning be conveyed in a short phrase?',
    options: [
      { label: 'Yes', nextStep: null, purpose: 'informational' },
      { label: 'No - it is complex (chart, diagram, etc.)', nextStep: null, purpose: 'complex' },
    ],
  },
];

export function getGuidelines(purpose: ImagePurpose): AltTextResult {
  switch (purpose) {
    case 'decorative':
      return {
        purpose,
        altAttribute: 'alt=""',
        explanation:
          'This image is decorative and does not convey meaningful information. Use an empty alt attribute so screen readers skip it. Optionally add role="presentation".',
      };
    case 'informational':
      return {
        purpose,
        altAttribute: 'alt="[Describe the content]"',
        explanation:
          'This image conveys information. Write a concise description of what the image shows. Be specific but brief (typically under 125 characters).',
      };
    case 'functional':
      return {
        purpose,
        altAttribute: 'alt="[Describe the action]"',
        explanation:
          'This image is used as a link or button. The alt text should describe the action or destination, not the image itself. For example: "Search", "Home page", "Download PDF".',
      };
    case 'complex':
      return {
        purpose,
        altAttribute: 'alt="[Brief description]" + long description',
        explanation:
          'This image is complex (chart, graph, diagram). Provide a brief alt text summarizing the image, then provide a detailed description nearby using a <figcaption>, a linked page, or aria-describedby.',
      };
  }
}

export function generateHtmlSnippet(
  purpose: ImagePurpose,
  altText: string,
): string {
  switch (purpose) {
    case 'decorative':
      return '<img src="image.png" alt="" role="presentation" />';
    case 'functional':
      return `<a href="destination">\n  <img src="image.png" alt="${escapeAttr(altText)}" />\n</a>`;
    case 'complex':
      return `<figure>\n  <img src="image.png" alt="${escapeAttr(altText)}" aria-describedby="desc" />\n  <figcaption id="desc">[Detailed description here]</figcaption>\n</figure>`;
    default:
      return `<img src="image.png" alt="${escapeAttr(altText)}" />`;
  }
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
