export type KaomojiCategory =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'love'
  | 'surprised'
  | 'greeting'
  | 'table-flip'
  | 'shrug'
  | 'animals'
  | 'food'
  | 'music';

export interface Kaomoji {
  text: string;
  category: KaomojiCategory;
  keywords: string[];
}

export const CATEGORY_LABELS: Record<KaomojiCategory, string> = {
  'happy': 'Happy',
  'sad': 'Sad',
  'angry': 'Angry',
  'love': 'Love',
  'surprised': 'Surprised',
  'greeting': 'Greeting',
  'table-flip': 'Table Flip',
  'shrug': 'Shrug',
  'animals': 'Animals',
  'food': 'Food',
  'music': 'Music',
};

export const CATEGORIES: KaomojiCategory[] = [
  'happy', 'sad', 'angry', 'love', 'surprised',
  'greeting', 'table-flip', 'shrug', 'animals', 'food', 'music',
];

export const KAOMOJI_DATABASE: Kaomoji[] = [
  // Happy
  { text: '(*^_^*)', category: 'happy', keywords: ['happy', 'smile', 'joy'] },
  { text: '(^_^)', category: 'happy', keywords: ['happy', 'smile'] },
  { text: '(^^)', category: 'happy', keywords: ['happy', 'smile'] },
  { text: '(*^^*)', category: 'happy', keywords: ['happy', 'smile'] },
  { text: '(^o^)', category: 'happy', keywords: ['excited', 'happy'] },
  { text: '(*^o^*)', category: 'happy', keywords: ['excited', 'happy'] },
  { text: '(\\(^o^)/)', category: 'happy', keywords: ['hurray', 'celebrate'] },
  { text: '(^_^)v', category: 'happy', keywords: ['peace', 'victory', 'happy'] },
  { text: '(=^_^=)', category: 'happy', keywords: ['smile', 'content'] },
  { text: '(*^_^*)b', category: 'happy', keywords: ['thumbs up', 'good'] },
  { text: '(^.^)', category: 'happy', keywords: ['smile', 'cute'] },
  { text: '(o^-^o)', category: 'happy', keywords: ['happy', 'bright'] },
  { text: 'o(^_^)o', category: 'happy', keywords: ['excited', 'jumping'] },
  { text: '\\(^_^)/', category: 'happy', keywords: ['celebration', 'hurray'] },
  { text: '(^_-)b', category: 'happy', keywords: ['wink', 'good'] },
  { text: '(*^-^)/', category: 'happy', keywords: ['wave', 'cheerful'] },
  { text: '(^^)/', category: 'happy', keywords: ['wave', 'happy'] },
  { text: '(*\\^-^*)', category: 'happy', keywords: ['content', 'happy'] },
  { text: '(^v^)', category: 'happy', keywords: ['happy', 'cheerful'] },
  { text: '(n_n)', category: 'happy', keywords: ['happy', 'pleased'] },

  // Sad
  { text: '(T_T)', category: 'sad', keywords: ['crying', 'sad', 'tears'] },
  { text: '(;_;)', category: 'sad', keywords: ['crying', 'sad'] },
  { text: '(>_<)', category: 'sad', keywords: ['frustrated', 'sad'] },
  { text: '(._. )', category: 'sad', keywords: ['sad', 'down'] },
  { text: '(TT)', category: 'sad', keywords: ['crying'] },
  { text: '(;-;)', category: 'sad', keywords: ['crying'] },
  { text: '( p_q)', category: 'sad', keywords: ['crying', 'tears'] },
  { text: '(ToT)', category: 'sad', keywords: ['crying', 'wailing'] },
  { text: '( ; ; )', category: 'sad', keywords: ['crying', 'sobbing'] },
  { text: '(>.<)', category: 'sad', keywords: ['pain', 'frustrated'] },
  { text: '(i_i)', category: 'sad', keywords: ['sad', 'tears'] },
  { text: '(u_u)', category: 'sad', keywords: ['sad', 'depressed'] },
  { text: '(-_-)', category: 'sad', keywords: ['blank', 'unimpressed'] },
  { text: "('_')", category: 'sad', keywords: ['blank', 'sad'] },
  { text: '(;o;)', category: 'sad', keywords: ['crying', 'wailing'] },
  { text: '(-.-)Zzz', category: 'sad', keywords: ['tired', 'sleepy'] },
  { text: '(._.)>', category: 'sad', keywords: ['sad', 'giving up'] },
  { text: '(x_x)', category: 'sad', keywords: ['dead', 'defeated'] },

  // Angry
  { text: "(`A')", category: 'angry', keywords: ['angry', 'shouting'] },
  { text: '(-_-#)', category: 'angry', keywords: ['angry', 'vein'] },
  { text: '(>_<#)', category: 'angry', keywords: ['frustrated', 'angry'] },
  { text: '(`o`)', category: 'angry', keywords: ['angry', 'mad'] },
  { text: '(--#)', category: 'angry', keywords: ['annoyed'] },
  { text: '(`e`)', category: 'angry', keywords: ['irritated'] },
  { text: '(>m<)', category: 'angry', keywords: ['annoyed', 'grr'] },
  { text: '(/_;)', category: 'angry', keywords: ['frustrated'] },
  { text: '(`_`)', category: 'angry', keywords: ['angry', 'mad'] },
  { text: '(-_-;)', category: 'angry', keywords: ['annoyed', 'sigh'] },
  { text: '(#^.^#)', category: 'angry', keywords: ['angry', 'blushing'] },
  { text: '(*`^`*)', category: 'angry', keywords: ['pouting', 'angry'] },
  { text: '(>_<)!', category: 'angry', keywords: ['angry', 'frustrated'] },
  { text: "(`A`)", category: 'angry', keywords: ['angry', 'yelling'] },

  // Love
  { text: '(*^3^*)', category: 'love', keywords: ['kiss', 'love'] },
  { text: '(^^)chu~', category: 'love', keywords: ['kiss', 'cute'] },
  { text: '(*-_-*)', category: 'love', keywords: ['dreamy', 'love'] },
  { text: '(^3^)', category: 'love', keywords: ['kiss'] },
  { text: '(*/\\*)', category: 'love', keywords: ['blushing', 'shy love'] },
  { text: '(*^^)v', category: 'love', keywords: ['peace', 'love'] },
  { text: '(^^*)', category: 'love', keywords: ['blushing', 'cute'] },
  { text: '(*^3^)/~chu~', category: 'love', keywords: ['kiss', 'love'] },
  { text: '(*^_^)_chu', category: 'love', keywords: ['kiss', 'love'] },
  { text: '(#^.^#)', category: 'love', keywords: ['blushing', 'love'] },
  { text: '(//-//)', category: 'love', keywords: ['blushing', 'shy'] },
  { text: '(*/_\\*)', category: 'love', keywords: ['shy', 'blushing'] },
  { text: '(/o\\)', category: 'love', keywords: ['shy', 'hiding'] },
  { text: '(^_^;)', category: 'love', keywords: ['nervous', 'sweat'] },
  { text: '(;^_^A', category: 'love', keywords: ['awkward', 'nervous'] },
  { text: '(*>_<*)', category: 'love', keywords: ['embarrassed', 'love'] },

  // Surprised
  { text: '(O_O)', category: 'surprised', keywords: ['shocked', 'surprised'] },
  { text: '(o_O)', category: 'surprised', keywords: ['confused', 'surprised'] },
  { text: '(O.O)', category: 'surprised', keywords: ['staring', 'shocked'] },
  { text: '(!!)', category: 'surprised', keywords: ['shocked'] },
  { text: '(*O*)', category: 'surprised', keywords: ['amazed'] },
  { text: '(0_0)', category: 'surprised', keywords: ['blank stare', 'shocked'] },
  { text: '(o_o;)', category: 'surprised', keywords: ['nervous', 'surprised'] },
  { text: '(@_@)', category: 'surprised', keywords: ['dizzy', 'overwhelmed'] },
  { text: '(#o#)', category: 'surprised', keywords: ['sparkle eyes'] },
  { text: '( ; o ; )', category: 'surprised', keywords: ['shocked', 'crying'] },
  { text: '(?_?)', category: 'surprised', keywords: ['confused', 'question'] },
  { text: '(-.-)??', category: 'surprised', keywords: ['thinking', 'confused'] },
  { text: '( ^_^)>?', category: 'surprised', keywords: ['thinking', 'wondering'] },

  // Greeting
  { text: '(^_^)/~', category: 'greeting', keywords: ['wave', 'hello', 'bye'] },
  { text: '(^-^)/', category: 'greeting', keywords: ['hello', 'wave'] },
  { text: '(*^-^)/', category: 'greeting', keywords: ['hello', 'cheerful'] },
  { text: '(^^)/', category: 'greeting', keywords: ['hello', 'wave'] },
  { text: '(^_^)/~~', category: 'greeting', keywords: ['goodbye', 'wave'] },
  { text: '(ToT)/~~~', category: 'greeting', keywords: ['sad goodbye'] },
  { text: '(*^_^)/~', category: 'greeting', keywords: ['friendly wave'] },
  { text: 'm(_ _)m', category: 'greeting', keywords: ['bow', 'apology', 'please'] },
  { text: '(>_<)b', category: 'greeting', keywords: ['good luck', 'thumbs up'] },
  { text: '(_ _)', category: 'greeting', keywords: ['bow', 'respect'] },
  { text: '(-.-)zzZ', category: 'greeting', keywords: ['sleeping', 'goodnight'] },
  { text: '(*^o^)/', category: 'greeting', keywords: ['hello', 'excited'] },

  // Table Flip
  { text: '(/_/)/', category: 'table-flip', keywords: ['table flip', 'rage'] },
  { text: '(>_<)/', category: 'table-flip', keywords: ['frustrated', 'flip'] },
  { text: '(/o_o)/', category: 'table-flip', keywords: ['table flip', 'shock'] },
  { text: '(`o`)/', category: 'table-flip', keywords: ['angry flip'] },
  { text: '(>_<;)/', category: 'table-flip', keywords: ['panic flip'] },
  { text: '(/_;)/', category: 'table-flip', keywords: ['sad flip'] },
  { text: '(-_-;)/', category: 'table-flip', keywords: ['resigned flip'] },
  { text: '( `_`)/', category: 'table-flip', keywords: ['calm flip'] },
  { text: '(^_^;)/', category: 'table-flip', keywords: ['nervous flip'] },
  { text: '(!_!)/', category: 'table-flip', keywords: ['shocked flip'] },

  // Shrug
  { text: '(^_^;)', category: 'shrug', keywords: ['shrug', 'nervous'] },
  { text: '(?_?)', category: 'shrug', keywords: ['shrug', 'confused'] },
  { text: '(-_-;)', category: 'shrug', keywords: ['shrug', 'sigh'] },
  { text: '(=_=)', category: 'shrug', keywords: ['shrug', 'tired', 'bored'] },
  { text: '(._. )', category: 'shrug', keywords: ['shrug', 'dunno'] },
  { text: '( -_-)', category: 'shrug', keywords: ['whatever', 'meh'] },
  { text: '(-.-)', category: 'shrug', keywords: ['thinking', 'hmm'] },
  { text: '(~_~)', category: 'shrug', keywords: ['uncertain', 'idk'] },
  { text: '(*_*)', category: 'shrug', keywords: ['confused', 'overwhelmed'] },
  { text: '(-.-)...', category: 'shrug', keywords: ['thinking', 'silence'] },

  // Animals
  { text: '(=^..^=)', category: 'animals', keywords: ['cat', 'neko'] },
  { text: '(=^-^=)', category: 'animals', keywords: ['cat', 'neko'] },
  { text: '(^._.^)', category: 'animals', keywords: ['cat'] },
  { text: '(U^_^U)', category: 'animals', keywords: ['dog', 'inu'] },
  { text: 'U^e^U', category: 'animals', keywords: ['dog'] },
  { text: '(^(oo)^)', category: 'animals', keywords: ['pig', 'buta'] },
  { text: '(=o_o=)', category: 'animals', keywords: ['cat', 'stare'] },
  { text: '(^._.^)~', category: 'animals', keywords: ['cat', 'tail'] },
  { text: '>^..^<', category: 'animals', keywords: ['cat', 'whiskers'] },
  { text: '(*^_^*)~', category: 'animals', keywords: ['bunny'] },
  { text: '(>_<)/', category: 'animals', keywords: ['bird'] },
  { text: '(^o^)~~', category: 'animals', keywords: ['fish', 'swimming'] },
  { text: '(=;e;=)', category: 'animals', keywords: ['cat', 'sad'] },
  { text: '(^_^)woof', category: 'animals', keywords: ['dog', 'bark'] },

  // Food
  { text: '(^_^)_c', category: 'food', keywords: ['coffee', 'tea', 'drink'] },
  { text: '(*^o^)/c', category: 'food', keywords: ['cheers', 'coffee'] },
  { text: '(^O^)/', category: 'food', keywords: ['cheers', 'toast'] },
  { text: '( ^_^)o-o(^_^ )', category: 'food', keywords: ['cheers', 'beer'] },
  { text: '( -_-)_c', category: 'food', keywords: ['tea', 'relax'] },
  { text: '(*^_^*)_c', category: 'food', keywords: ['coffee', 'happy'] },
  { text: '(^_^)_旦', category: 'food', keywords: ['tea', 'japanese'] },
  { text: '(*^o^)_c', category: 'food', keywords: ['drink', 'coffee'] },
  { text: '(>_<)_c', category: 'food', keywords: ['need coffee', 'tired'] },
  { text: '(^_^)~□', category: 'food', keywords: ['toast', 'beer'] },
  { text: '(*^_^)_旦~~', category: 'food', keywords: ['tea', 'offering'] },
  { text: '(^o^)_旦~~', category: 'food', keywords: ['tea', 'serve'] },

  // Music
  { text: '(^_^)~♪', category: 'music', keywords: ['music', 'happy', 'singing'] },
  { text: '(*^o^)♪', category: 'music', keywords: ['music', 'singing'] },
  { text: '(^_^)/♪', category: 'music', keywords: ['music', 'wave'] },
  { text: '♪(^_^)♪', category: 'music', keywords: ['music', 'dancing'] },
  { text: '♪(*^_^*)♪', category: 'music', keywords: ['music', 'happy'] },
  { text: '(^o^)~♪♪', category: 'music', keywords: ['music', 'notes'] },
  { text: '♪(^^)♪', category: 'music', keywords: ['music', 'humming'] },
  { text: '(^_^)♪~', category: 'music', keywords: ['music', 'melody'] },
  { text: '♪♪(*^o^)/', category: 'music', keywords: ['music', 'excited'] },
  { text: '(*^_^)♪♪♪', category: 'music', keywords: ['music', 'many notes'] },
  { text: '(^v^)♪', category: 'music', keywords: ['music', 'cheerful'] },
  { text: '♪(n_n)♪', category: 'music', keywords: ['music', 'pleased'] },
  { text: '(*^o^*)~♪', category: 'music', keywords: ['music', 'karaoke'] },
  { text: '♪♪♪(^_^)♪♪♪', category: 'music', keywords: ['music', 'concert'] },
];

/**
 * Search kaomojis by query string.
 */
export function searchKaomojis(query: string): Kaomoji[] {
  if (!query.trim()) return KAOMOJI_DATABASE;
  const lower = query.toLowerCase();
  return KAOMOJI_DATABASE.filter(
    (k) =>
      k.keywords.some((kw) => kw.toLowerCase().includes(lower)) ||
      k.text.toLowerCase().includes(lower) ||
      CATEGORY_LABELS[k.category].toLowerCase().includes(lower)
  );
}

/**
 * Filter kaomojis by category.
 */
export function filterByCategory(category: KaomojiCategory): Kaomoji[] {
  return KAOMOJI_DATABASE.filter((k) => k.category === category);
}

const RECENT_KEY = 'kaomoji-picker-recent';
const MAX_RECENT = 20;

/**
 * Get recently used kaomojis from localStorage.
 */
export function getRecentKaomojis(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a kaomoji to recent list in localStorage.
 */
export function addRecentKaomoji(kaomoji: string): void {
  try {
    const recent = getRecentKaomojis().filter((k) => k !== kaomoji);
    recent.unshift(kaomoji);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable
  }
}
