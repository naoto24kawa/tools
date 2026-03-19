export interface DecisionNode {
  id: string;
  question: string;
  description: string;
  yesId: string | null;
  noId: string | null;
  result?: AltTextResult;
}

export interface AltTextResult {
  recommendation: string;
  altAttribute: string;
  explanation: string;
  tips: string[];
}

export const DECISION_TREE: DecisionNode[] = [
  {
    id: 'start',
    question: 'Does the image contain text?',
    description: 'Check if there is meaningful text rendered within the image.',
    yesId: 'text-only',
    noId: 'decorative-check',
  },
  {
    id: 'text-only',
    question: 'Is the text also present as real text nearby?',
    description: 'Is the same text already provided in the surrounding HTML content?',
    yesId: 'text-decorative',
    noId: 'text-informational',
  },
  {
    id: 'text-decorative',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Use empty alt (decorative)',
      altAttribute: 'alt=""',
      explanation: 'Since the text is already available nearby, the image is decorative and should have an empty alt attribute to avoid redundancy.',
      tips: [
        'Never omit the alt attribute entirely - use alt="" for decorative images',
        'Screen readers will skip images with alt=""',
        'If using CSS background-image, no alt is needed',
      ],
    },
  },
  {
    id: 'text-informational',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Include the text in alt',
      altAttribute: 'alt="[exact text from image]"',
      explanation: 'The text in the image conveys information not available elsewhere. Include the exact text as the alt attribute value.',
      tips: [
        'Reproduce the text exactly as it appears in the image',
        'For logos with text, include the text: alt="Company Name logo"',
        'Consider whether the image could be replaced with styled HTML text',
      ],
    },
  },
  {
    id: 'decorative-check',
    question: 'Is the image purely decorative?',
    description: 'A decorative image adds visual interest but does not provide information or functionality. Examples: borders, spacers, background patterns.',
    yesId: 'decorative-result',
    noId: 'functional-check',
  },
  {
    id: 'decorative-result',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Use empty alt (decorative)',
      altAttribute: 'alt=""',
      explanation: 'Decorative images should have an empty alt attribute. This tells assistive technologies to ignore the image.',
      tips: [
        'Consider using CSS background-image for truly decorative images',
        'Decorative images include: visual flourishes, redundant icons next to text labels',
        'When in doubt, err on the side of providing alt text',
      ],
    },
  },
  {
    id: 'functional-check',
    question: 'Is the image a link or button?',
    description: 'Is the image used as an interactive element (link, button, or input)?',
    yesId: 'functional-result',
    noId: 'complex-check',
  },
  {
    id: 'functional-result',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Describe the action/destination',
      altAttribute: 'alt="[action or destination]"',
      explanation: 'For functional images, the alt text should describe the action that will occur or the destination, not the image appearance.',
      tips: [
        'For a search icon button: alt="Search" (not "magnifying glass")',
        'For a logo linking to home: alt="Company Name - Home page"',
        'For a print icon: alt="Print this page"',
        'The alt text replaces the image entirely for screen reader users',
      ],
    },
  },
  {
    id: 'complex-check',
    question: 'Is it a complex image (chart, graph, diagram)?',
    description: 'Complex images contain substantial information that requires more than a short phrase to describe.',
    yesId: 'complex-result',
    noId: 'informational-result',
  },
  {
    id: 'complex-result',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Short alt + long description',
      altAttribute: 'alt="[brief description]" with additional long description',
      explanation: 'Provide a brief alt text identifying the image, then provide detailed description elsewhere (using aria-describedby, a details element, or a link to a description page).',
      tips: [
        'Alt text: identify the type of image and topic (e.g., "Bar chart showing quarterly revenue")',
        'Provide full data in an accessible table or long description',
        'Use aria-describedby to link to the detailed description',
        'Consider providing a data table as an alternative',
      ],
    },
  },
  {
    id: 'informational-result',
    question: '',
    description: '',
    yesId: null,
    noId: null,
    result: {
      recommendation: 'Describe the content and purpose',
      altAttribute: 'alt="[description of content]"',
      explanation: 'Describe what the image shows and why it is important in the current context. Focus on the information the image conveys, not how it looks.',
      tips: [
        'Be concise but descriptive (typically under 125 characters)',
        'Do not start with "Image of..." or "Picture of..." - screen readers already announce it as an image',
        'Describe what is meaningful in context, not every visual detail',
        'Consider: if you removed this image, what information would be lost?',
      ],
    },
  },
];

/**
 * Get a node by ID from the decision tree.
 */
export function getNode(id: string): DecisionNode | undefined {
  return DECISION_TREE.find((n) => n.id === id);
}

/**
 * Get the starting node of the decision tree.
 */
export function getStartNode(): DecisionNode {
  return DECISION_TREE[0];
}

/**
 * Generate an HTML snippet for the recommended alt attribute.
 */
export function generateHtmlSnippet(altText: string): string {
  return `<img src="image.jpg" ${altText} />`;
}

/**
 * General alt text tips applicable to all images.
 */
export const GENERAL_TIPS = [
  'Always include the alt attribute on <img> elements, even if empty',
  'Keep alt text concise - ideally under 125 characters',
  'Do not include "image of" or "photo of" - screen readers already announce it as an image',
  'Consider the context - the same image may need different alt text on different pages',
  'Test by reading your alt text aloud - does it convey the same information?',
  'Alt text should be a suitable replacement for the image, not a description of the image',
];
