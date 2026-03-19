export type KaomojiCategory =
  | 'Happy'
  | 'Sad'
  | 'Angry'
  | 'Surprised'
  | 'Love'
  | 'Greeting'
  | 'Shy'
  | 'Confused'
  | 'Animals'
  | 'Actions'
  | 'Special';

export interface Kaomoji {
  text: string;
  category: KaomojiCategory;
  keywords: string[];
}

export const CATEGORIES: KaomojiCategory[] = [
  'Happy', 'Sad', 'Angry', 'Surprised', 'Love',
  'Greeting', 'Shy', 'Confused', 'Animals', 'Actions', 'Special',
];

export const KAOMOJI_DATA: Kaomoji[] = [
  // Happy
  { text: '(*^_^*)', category: 'Happy', keywords: ['smile', 'happy', 'joy'] },
  { text: '(^_^)', category: 'Happy', keywords: ['smile', 'happy'] },
  { text: '(^^)', category: 'Happy', keywords: ['smile', 'happy'] },
  { text: '(*^^*)', category: 'Happy', keywords: ['smile', 'happy'] },
  { text: '(^o^)', category: 'Happy', keywords: ['excited', 'happy', 'open mouth'] },
  { text: '(*^o^*)', category: 'Happy', keywords: ['excited', 'happy'] },
  { text: '(\\(^o^)/)', category: 'Happy', keywords: ['hurray', 'celebrate'] },
  { text: '(*\\^-^*)', category: 'Happy', keywords: ['content', 'happy'] },
  { text: '(^_^)v', category: 'Happy', keywords: ['peace', 'victory', 'happy'] },
  { text: '(=^_^=)', category: 'Happy', keywords: ['smile', 'content'] },
  { text: '(*^_^*)b', category: 'Happy', keywords: ['thumbs up', 'good'] },
  { text: '(^.^)', category: 'Happy', keywords: ['smile', 'cute'] },
  { text: '(^^)/', category: 'Happy', keywords: ['wave', 'happy'] },
  { text: '(o^-^o)', category: 'Happy', keywords: ['happy', 'bright'] },
  { text: '(*^-^)/', category: 'Happy', keywords: ['wave', 'cheerful'] },
  { text: '(^_-)b', category: 'Happy', keywords: ['wink', 'good'] },
  { text: 'o(^_^)o', category: 'Happy', keywords: ['excited', 'jumping'] },
  { text: '\\(^_^)/', category: 'Happy', keywords: ['celebration', 'hurray'] },

  // Sad
  { text: '(T_T)', category: 'Sad', keywords: ['crying', 'sad', 'tears'] },
  { text: '(;_;)', category: 'Sad', keywords: ['crying', 'sad'] },
  { text: '(>_<)', category: 'Sad', keywords: ['frustrated', 'sad'] },
  { text: '(._. )', category: 'Sad', keywords: ['sad', 'down'] },
  { text: '(TT)', category: 'Sad', keywords: ['crying'] },
  { text: '(;-;)', category: 'Sad', keywords: ['crying'] },
  { text: '( p_q)', category: 'Sad', keywords: ['crying', 'tears'] },
  { text: '(ToT)', category: 'Sad', keywords: ['crying', 'wailing'] },
  { text: '( ; ; )', category: 'Sad', keywords: ['crying', 'sobbing'] },
  { text: '(>.<)', category: 'Sad', keywords: ['pain', 'frustrated'] },
  { text: '(i_i)', category: 'Sad', keywords: ['sad', 'tears'] },
  { text: '(u_u)', category: 'Sad', keywords: ['sad', 'depressed'] },
  { text: '(-_-)', category: 'Sad', keywords: ['blank', 'unimpressed'] },
  { text: '(._. )', category: 'Sad', keywords: ['looking down'] },
  { text: "('_')", category: 'Sad', keywords: ['blank', 'sad'] },
  { text: '(;o;)', category: 'Sad', keywords: ['crying', 'wailing'] },

  // Angry
  { text: '(`_`)', category: 'Angry', keywords: ['angry', 'mad'] },
  { text: "(`A')", category: 'Angry', keywords: ['angry', 'shouting'] },
  { text: '(-_-#)', category: 'Angry', keywords: ['angry', 'vein'] },
  { text: '(#^.^#)', category: 'Angry', keywords: ['angry', 'blushing'] },
  { text: '(>_<#)', category: 'Angry', keywords: ['frustrated', 'angry'] },
  { text: '(`o`)', category: 'Angry', keywords: ['angry', 'mad'] },
  { text: '(--#)', category: 'Angry', keywords: ['annoyed'] },
  { text: '(`e`)', category: 'Angry', keywords: ['irritated'] },
  { text: '(>m<)', category: 'Angry', keywords: ['annoyed', 'grr'] },
  { text: '(/_;)', category: 'Angry', keywords: ['frustrated'] },

  // Surprised
  { text: '(O_O)', category: 'Surprised', keywords: ['shocked', 'surprised'] },
  { text: '(o_O)', category: 'Surprised', keywords: ['confused', 'surprised'] },
  { text: '(O.O)', category: 'Surprised', keywords: ['staring', 'shocked'] },
  { text: '(!!)', category: 'Surprised', keywords: ['shocked'] },
  { text: '(*O*)', category: 'Surprised', keywords: ['amazed'] },
  { text: '(0_0)', category: 'Surprised', keywords: ['blank stare', 'shocked'] },
  { text: '(o_o;)', category: 'Surprised', keywords: ['nervous', 'surprised'] },
  { text: '(@_@)', category: 'Surprised', keywords: ['dizzy', 'overwhelmed'] },
  { text: '(#o#)', category: 'Surprised', keywords: ['sparkle eyes'] },
  { text: '( ; o ; )', category: 'Surprised', keywords: ['shocked', 'crying'] },

  // Love
  { text: '(*^3^*)', category: 'Love', keywords: ['kiss', 'love'] },
  { text: '(^^)chu~', category: 'Love', keywords: ['kiss', 'cute'] },
  { text: '(*-_-*)', category: 'Love', keywords: ['dreamy', 'love'] },
  { text: '(#^.^#)', category: 'Love', keywords: ['blushing', 'love'] },
  { text: '(^3^)', category: 'Love', keywords: ['kiss'] },
  { text: '(-_-)zzZ', category: 'Love', keywords: ['sleeping', 'dreaming'] },
  { text: '(*/\\*)', category: 'Love', keywords: ['blushing', 'shy love'] },
  { text: '(*^^)v', category: 'Love', keywords: ['peace', 'love'] },
  { text: '(^^*)', category: 'Love', keywords: ['blushing', 'cute'] },

  // Greeting
  { text: '(^_^)/~', category: 'Greeting', keywords: ['wave', 'hello', 'bye'] },
  { text: '(^-^)/', category: 'Greeting', keywords: ['hello', 'wave'] },
  { text: '(*^-^)/', category: 'Greeting', keywords: ['hello', 'cheerful'] },
  { text: '(^^)/', category: 'Greeting', keywords: ['hello', 'wave'] },
  { text: '(^_^)/~~', category: 'Greeting', keywords: ['goodbye', 'wave'] },
  { text: '(ToT)/~~~', category: 'Greeting', keywords: ['sad goodbye'] },
  { text: '(*^_^)/~', category: 'Greeting', keywords: ['friendly wave'] },
  { text: 'm(_ _)m', category: 'Greeting', keywords: ['bow', 'apology', 'please'] },
  { text: '(>_<)b', category: 'Greeting', keywords: ['good luck', 'thumbs up'] },
  { text: '(_ _)', category: 'Greeting', keywords: ['bow', 'respect'] },
  { text: '(-.-)zzZ', category: 'Greeting', keywords: ['sleeping', 'goodnight'] },

  // Shy
  { text: '(*/w\\*)', category: 'Shy', keywords: ['shy', 'embarrassed'] },
  { text: '(/o\\)', category: 'Shy', keywords: ['shy', 'hiding'] },
  { text: '(>_<)', category: 'Shy', keywords: ['embarrassed'] },
  { text: '(*/_\\*)', category: 'Shy', keywords: ['shy', 'blushing'] },
  { text: '(>.<)', category: 'Shy', keywords: ['embarrassed'] },
  { text: '(^_^;)', category: 'Shy', keywords: ['nervous', 'sweat'] },
  { text: '(;^_^A', category: 'Shy', keywords: ['awkward', 'nervous'] },
  { text: '(^_^;)>', category: 'Shy', keywords: ['nervous', 'apologetic'] },
  { text: '(//-//)' , category: 'Shy', keywords: ['blushing', 'shy'] },

  // Confused
  { text: '(^_^;)', category: 'Confused', keywords: ['confused', 'nervous'] },
  { text: '(?_?)', category: 'Confused', keywords: ['confused', 'question'] },
  { text: '(-.-)??', category: 'Confused', keywords: ['thinking', 'confused'] },
  { text: '(@_@)', category: 'Confused', keywords: ['dizzy', 'confused'] },
  { text: '(o_O)', category: 'Confused', keywords: ['skeptical'] },
  { text: '(=_=)', category: 'Confused', keywords: ['tired', 'bored'] },
  { text: '(-_-;)', category: 'Confused', keywords: ['speechless'] },
  { text: '( ^_^)>?', category: 'Confused', keywords: ['thinking'] },

  // Animals
  { text: '(=^..^=)', category: 'Animals', keywords: ['cat', 'neko'] },
  { text: '(=^-^=)', category: 'Animals', keywords: ['cat', 'neko'] },
  { text: '(^._.^)', category: 'Animals', keywords: ['cat'] },
  { text: '(U^_^U)', category: 'Animals', keywords: ['dog', 'inu'] },
  { text: 'U^ェ^U', category: 'Animals', keywords: ['dog'] },
  { text: '(>_<)/', category: 'Animals', keywords: ['bird'] },
  { text: '(^(oo)^)', category: 'Animals', keywords: ['pig', 'buta'] },
  { text: '(=o_o=)', category: 'Animals', keywords: ['cat', 'stare'] },
  { text: '(^._.^)~', category: 'Animals', keywords: ['cat', 'tail'] },
  { text: '(*^_^*)~', category: 'Animals', keywords: ['bunny'] },
  { text: '>^..^<', category: 'Animals', keywords: ['cat', 'whiskers'] },

  // Actions
  { text: '(*_*)zzZ', category: 'Actions', keywords: ['sleeping'] },
  { text: '(^_^)_旦', category: 'Actions', keywords: ['tea', 'drink'] },
  { text: '(^O^)/', category: 'Actions', keywords: ['cheers', 'toast'] },
  { text: '(*^_^)b', category: 'Actions', keywords: ['thumbs up', 'good'] },
  { text: '(T_T)/', category: 'Actions', keywords: ['waving', 'crying'] },
  { text: '(^_^)v', category: 'Actions', keywords: ['peace sign'] },
  { text: '(*^o^)/', category: 'Actions', keywords: ['excited wave'] },
  { text: '(-_-)...', category: 'Actions', keywords: ['thinking', 'silence'] },
  { text: '(^_-)b', category: 'Actions', keywords: ['wink', 'approved'] },
  { text: '(>_<;)', category: 'Actions', keywords: ['running', 'hurry'] },

  // Special
  { text: '( . Y . )', category: 'Special', keywords: ['funny', 'face'] },
  { text: '(^_^) ~ (^_^)', category: 'Special', keywords: ['friends'] },
  { text: '(T_T) -> (^_^)', category: 'Special', keywords: ['cheer up'] },
  { text: '[*_*]', category: 'Special', keywords: ['robot'] },
  { text: '(^_^)><(^_^)', category: 'Special', keywords: ['hug', 'friends'] },
  { text: '(*^3^)/~chu~', category: 'Special', keywords: ['kiss', 'love'] },
  { text: '(*^_^)人(^_^*)', category: 'Special', keywords: ['high five'] },
  { text: '( -_-)旦~', category: 'Special', keywords: ['tea', 'relax'] },
  { text: '(^_^)o自自o(^_^)', category: 'Special', keywords: ['cheers', 'beer'] },
  { text: '( ^_^)/□☆□\\(^_^ )', category: 'Special', keywords: ['toast', 'cheers'] },
];

export function filterKaomoji(
  data: Kaomoji[],
  search: string,
  category: KaomojiCategory | 'All'
): Kaomoji[] {
  let filtered = data;

  if (category !== 'All') {
    filtered = filtered.filter((k) => k.category === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (k) =>
        k.text.includes(q) ||
        k.keywords.some((kw) => kw.includes(q)) ||
        k.category.toLowerCase().includes(q)
    );
  }

  return filtered;
}
