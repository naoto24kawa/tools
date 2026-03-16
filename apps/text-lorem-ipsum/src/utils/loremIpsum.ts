const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
  'vitae',
  'elementum',
  'curabitur',
  'sollicitudin',
  'purus',
  'blandit',
  'volutpat',
  'maecenas',
  'accumsan',
  'lacus',
  'vel',
  'facilisis',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord(): string {
  return LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)];
}

function generateSentence(minWords: number, maxWords: number): string {
  const wordCount = randomInt(minWords, maxWords);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return `${words.join(' ')}.`;
}

function generateParagraph(minSentences: number, maxSentences: number): string {
  const sentenceCount = randomInt(minSentences, maxSentences);
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence(5, 15));
  }
  return sentences.join(' ');
}

const UNIT_OPTIONS = [
  { value: 'paragraphs', label: '段落' },
  { value: 'sentences', label: '文' },
  { value: 'words', label: '単語' },
] as const;

export { UNIT_OPTIONS };

export type UnitType = (typeof UNIT_OPTIONS)[number]['value'];

export interface GenerateOptions {
  count: number;
  unit: UnitType;
  startWithLorem: boolean;
}

function generateParagraphs(count: number, startWithLorem: boolean): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      paragraphs.push(`${FIRST_SENTENCE} ${generateParagraph(2, 4)}`);
    } else {
      paragraphs.push(generateParagraph(3, 6));
    }
  }
  return paragraphs.join('\n\n');
}

function generateSentences(count: number, startWithLorem: boolean): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0 && startWithLorem) {
      sentences.push(FIRST_SENTENCE);
    } else {
      sentences.push(generateSentence(5, 15));
    }
  }
  return sentences.join(' ');
}

function generateWords(count: number, startWithLorem: boolean): string {
  const words: string[] = [];
  if (startWithLorem) {
    const loremWords = FIRST_SENTENCE.replace('.', '').split(' ');
    for (let i = 0; i < Math.min(count, loremWords.length); i++) {
      words.push(loremWords[i]);
    }
  }
  while (words.length < count) {
    words.push(randomWord());
  }
  return words.join(' ');
}

export function generateLoremIpsum(options: GenerateOptions): string {
  const { count, unit, startWithLorem } = options;
  if (count <= 0) return '';

  switch (unit) {
    case 'paragraphs':
      return generateParagraphs(count, startWithLorem);
    case 'sentences':
      return generateSentences(count, startWithLorem);
    case 'words':
      return generateWords(count, startWithLorem);
    default: {
      const _exhaustiveCheck: never = unit;
      throw new Error(`Unsupported unit type: ${_exhaustiveCheck}`);
    }
  }
}
