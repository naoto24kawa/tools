export type AppCategory =
  | 'Text'
  | 'Encode'
  | 'Crypto'
  | 'Number'
  | 'DateTime'
  | 'JSON'
  | 'Code'
  | 'Color / CSS'
  | 'Image'
  | 'PDF'
  | 'Video'
  | 'Generator'
  | 'Network';

export interface AppInfo {
  path: string;
  icon: string;
  displayName: string;
  description: string;
  category: AppCategory;
}

export const CATEGORY_ICONS: Record<AppCategory, string> = {
  Text: '📝',
  Encode: '🔤',
  Crypto: '🔐',
  Number: '🔢',
  DateTime: '📅',
  JSON: '{}',
  Code: '💻',
  'Color / CSS': '🎨',
  Image: '🖼',
  PDF: '📄',
  Video: '🎬',
  Generator: '⚙',
  Network: '🌐',
};

export const CATEGORY_COLORS: Record<AppCategory, string> = {
  Text: 'bg-blue-500',
  Encode: 'bg-indigo-500',
  Crypto: 'bg-purple-500',
  Number: 'bg-pink-500',
  DateTime: 'bg-orange-500',
  JSON: 'bg-yellow-600',
  Code: 'bg-green-500',
  'Color / CSS': 'bg-rose-500',
  Image: 'bg-teal-500',
  PDF: 'bg-red-500',
  Video: 'bg-violet-500',
  Generator: 'bg-cyan-500',
  Network: 'bg-emerald-500',
};

export const APPS: AppInfo[] = [
  // Text
  { path: '/text-counter', icon: '📝', displayName: 'Text Counter', description: '文字数・単語数・行数をリアルタイムカウント', category: 'Text' },
  { path: '/text-deduplicate', icon: '🔀', displayName: 'Text Deduplicate', description: 'テキストの重複行を削除', category: 'Text' },
  { path: '/text-diff-checker', icon: '🔍', displayName: 'Text Diff Checker', description: '2つのテキストの差分を比較表示', category: 'Text' },
  { path: '/text-case-converter', icon: '🔤', displayName: 'Text Case Converter', description: '大文字/小文字変換', category: 'Text' },
  { path: '/text-code-case', icon: '🐍', displayName: 'Code Case Converter', description: 'camelCase, snake_case等の命名規則変換', category: 'Text' },
  { path: '/text-reverse', icon: '🔄', displayName: 'Text Reverse', description: 'テキスト逆順変換', category: 'Text' },
  { path: '/text-sort', icon: '📊', displayName: 'Text Sort', description: 'テキスト行ソート', category: 'Text' },
  { path: '/text-replace', icon: '🔁', displayName: 'Text Replace', description: 'テキスト検索・置換', category: 'Text' },
  { path: '/text-line-number', icon: '🔢', displayName: 'Line Number', description: '行番号付与', category: 'Text' },
  { path: '/text-prefix-suffix', icon: '📎', displayName: 'Prefix Suffix', description: 'プレフィックス・サフィックス追加', category: 'Text' },
  { path: '/text-slugify', icon: '🔗', displayName: 'Slugify', description: 'URLスラッグ生成', category: 'Text' },
  { path: '/text-lorem-ipsum', icon: '📄', displayName: 'Lorem Ipsum', description: 'ダミーテキスト生成', category: 'Text' },
  { path: '/text-word-frequency', icon: '📈', displayName: 'Word Frequency', description: '単語出現頻度解析', category: 'Text' },
  { path: '/text-fullwidth-halfwidth', icon: 'Ａ', displayName: 'Fullwidth Halfwidth', description: '全角・半角変換', category: 'Text' },
  { path: '/text-kana-converter', icon: 'あ', displayName: 'Kana Converter', description: 'ひらがな・カタカナ変換', category: 'Text' },
  { path: '/text-bionic-reading', icon: '👁', displayName: 'Bionic Reading', description: 'Bionic Reading変換', category: 'Text' },
  { path: '/text-markdown-html', icon: '📑', displayName: 'Markdown to HTML', description: 'Markdown→HTML変換', category: 'Text' },
  { path: '/text-markdown-preview', icon: '👀', displayName: 'Markdown Preview', description: 'Markdownプレビュー', category: 'Text' },

  // Encode
  { path: '/url-encoder', icon: '🔗', displayName: 'URL Encoder', description: 'URLエンコード・デコード', category: 'Encode' },
  { path: '/encode-base64-string', icon: '🔤', displayName: 'Base64 Encoder', description: 'Base64文字列エンコード・デコード', category: 'Encode' },
  { path: '/encode-base64-file', icon: '📁', displayName: 'Base64 File', description: 'ファイルBase64変換', category: 'Encode' },
  { path: '/encode-base32', icon: '🔡', displayName: 'Base32 Encoder', description: 'Base32エンコード・デコード', category: 'Encode' },
  { path: '/encode-binary', icon: '💻', displayName: 'Binary Converter', description: 'テキスト-バイナリ変換', category: 'Encode' },
  { path: '/encode-html-entity', icon: '&', displayName: 'HTML Entity', description: 'HTMLエンティティ変換', category: 'Encode' },
  { path: '/encode-morse', icon: '📡', displayName: 'Morse Code', description: 'モールス符号変換', category: 'Encode' },
  { path: '/encode-punycode', icon: '🌐', displayName: 'Punycode', description: 'Punycode変換', category: 'Encode' },
  { path: '/encode-unicode', icon: '🔣', displayName: 'Unicode Escape', description: 'Unicodeエスケープ変換', category: 'Encode' },
  { path: '/uuencode', icon: '📦', displayName: 'UUEncode', description: 'UUEncode/UUDecode', category: 'Encode' },

  // Crypto
  { path: '/hash-md5', icon: '#', displayName: 'MD5 Hash', description: 'MD5ハッシュ生成', category: 'Crypto' },
  { path: '/hash-sha1', icon: '#', displayName: 'SHA-1 Hash', description: 'SHA-1ハッシュ生成', category: 'Crypto' },
  { path: '/hash-sha256', icon: '#', displayName: 'SHA Hash', description: 'SHA-256/384/512ハッシュ生成', category: 'Crypto' },
  { path: '/hash-crc32', icon: '✅', displayName: 'CRC32', description: 'CRC32チェックサム', category: 'Crypto' },
  { path: '/hash-hmac', icon: '🔑', displayName: 'HMAC Generator', description: 'HMAC認証コード生成', category: 'Crypto' },
  { path: '/aes-encrypt', icon: '🔐', displayName: 'AES Encrypt', description: 'AES-256-GCM暗号化・復号化', category: 'Crypto' },
  { path: '/des-encrypt', icon: '🔐', displayName: 'DES Encrypt', description: 'Triple DES暗号化・復号化', category: 'Crypto' },
  { path: '/bcrypt-hash', icon: '🔒', displayName: 'Bcrypt Hash', description: 'Bcryptハッシュ生成・検証', category: 'Crypto' },
  { path: '/rsa-keygen', icon: '🗝', displayName: 'RSA Key Generator', description: 'RSA鍵ペア生成', category: 'Crypto' },
  { path: '/crypto-caesar', icon: '🏛', displayName: 'Caesar Cipher', description: 'シーザー暗号', category: 'Crypto' },
  { path: '/crypto-rot13', icon: '🔄', displayName: 'ROT13', description: 'ROT13変換', category: 'Crypto' },
  { path: '/crypto-vigenere', icon: '📜', displayName: 'Vigenere Cipher', description: 'ヴィジュネル暗号', category: 'Crypto' },
  { path: '/crypto-atbash', icon: '🪞', displayName: 'Atbash Cipher', description: 'アトバシュ暗号', category: 'Crypto' },
  { path: '/crypto-affine', icon: '🔢', displayName: 'Affine Cipher', description: 'アフィン暗号', category: 'Crypto' },
  { path: '/crypto-rail-fence', icon: '🚂', displayName: 'Rail Fence Cipher', description: 'レールフェンス暗号', category: 'Crypto' },
  { path: '/enigma-cipher', icon: '⚙', displayName: 'Enigma Cipher', description: 'Enigma暗号シミュレーター', category: 'Crypto' },

  // Number
  { path: '/number-base-converter', icon: '🔢', displayName: 'Base Converter', description: '2進/8進/10進/16進数変換', category: 'Number' },
  { path: '/number-fraction', icon: '➗', displayName: 'Fraction', description: '小数→分数変換', category: 'Number' },
  { path: '/number-kanji', icon: '漢', displayName: 'Kanji Number', description: '漢数字変換', category: 'Number' },
  { path: '/math-calculator', icon: '🧮', displayName: 'Calculator', description: '電卓', category: 'Number' },
  { path: '/math-percentage', icon: '%', displayName: 'Percentage', description: '割合・パーセント計算', category: 'Number' },
  { path: '/math-statistics', icon: '📊', displayName: 'Statistics', description: '統計計算', category: 'Number' },
  { path: '/math-area', icon: '📐', displayName: 'Area Calculator', description: '面積計算', category: 'Number' },
  { path: '/unit-converter', icon: '⚖', displayName: 'Unit Converter', description: '単位変換', category: 'Number' },
  { path: '/random-number', icon: '🎲', displayName: 'Random Number', description: '乱数生成', category: 'Number' },
  { path: '/random-dice', icon: '🎲', displayName: 'Dice Roller', description: 'サイコロシミュレーター', category: 'Number' },
  { path: '/random-coin', icon: '🪙', displayName: 'Coin Flip', description: 'コイン投げシミュレーター', category: 'Number' },

  // DateTime
  { path: '/datetime-unix', icon: '🕐', displayName: 'Unix Timestamp', description: 'UNIXタイムスタンプ変換', category: 'DateTime' },
  { path: '/datetime-iso8601', icon: '📅', displayName: 'ISO 8601', description: 'ISO 8601形式変換', category: 'DateTime' },
  { path: '/datetime-rfc2822', icon: '📧', displayName: 'RFC 2822', description: 'RFC 2822形式変換', category: 'DateTime' },
  { path: '/datetime-diff', icon: '📏', displayName: 'Date Diff', description: '日付差分計算', category: 'DateTime' },
  { path: '/datetime-wareki', icon: '🏯', displayName: 'Wareki Converter', description: '和暦変換', category: 'DateTime' },
  { path: '/datetime-world-clock', icon: '🌍', displayName: 'World Clock', description: '世界時計', category: 'DateTime' },
  { path: '/datetime-countdown', icon: '⏳', displayName: 'Countdown', description: 'カウントダウン', category: 'DateTime' },
  { path: '/datetime-timer', icon: '⏱', displayName: 'Timer', description: 'タイマー', category: 'DateTime' },
  { path: '/datetime-stopwatch', icon: '⏱', displayName: 'Stopwatch', description: 'ストップウォッチ', category: 'DateTime' },
  { path: '/datetime-crontab', icon: '⚙', displayName: 'Crontab', description: 'Cron式生成・パース', category: 'DateTime' },
  { path: '/datetime-eta', icon: '🚀', displayName: 'ETA Calculator', description: '到着予想時刻計算', category: 'DateTime' },

  // JSON
  { path: '/json-formatter', icon: '{}', displayName: 'JSON Formatter', description: 'JSON整形', category: 'JSON' },
  { path: '/json-minify', icon: '📦', displayName: 'JSON Minify', description: 'JSON圧縮', category: 'JSON' },
  { path: '/json-validator', icon: '✅', displayName: 'JSON Validator', description: 'JSON検証', category: 'JSON' },
  { path: '/json-viewer', icon: '🌳', displayName: 'JSON Viewer', description: 'JSONツリービュー', category: 'JSON' },
  { path: '/json-editor', icon: '✏', displayName: 'JSON Editor', description: 'JSONエディタ', category: 'JSON' },
  { path: '/json-diff', icon: '🔍', displayName: 'JSON Diff', description: 'JSON差分比較', category: 'JSON' },
  { path: '/json-to-csv', icon: '📊', displayName: 'JSON to CSV', description: 'JSON→CSV変換', category: 'JSON' },
  { path: '/json-to-yaml', icon: '📝', displayName: 'JSON to YAML', description: 'JSON→YAML変換', category: 'JSON' },
  { path: '/json-to-xml', icon: '📄', displayName: 'JSON to XML', description: 'JSON→XML変換', category: 'JSON' },
  { path: '/json-to-toml', icon: '⚙', displayName: 'JSON to TOML', description: 'JSON→TOML変換', category: 'JSON' },
  { path: '/json-to-table', icon: '📋', displayName: 'JSON to Table', description: 'JSON→テーブル変換', category: 'JSON' },
  { path: '/jsonpath-tester', icon: '🎯', displayName: 'JSONPath Tester', description: 'JSONPath式テスト', category: 'JSON' },

  // Code
  { path: '/html-formatter', icon: '🌐', displayName: 'HTML Formatter', description: 'HTML整形', category: 'Code' },
  { path: '/html-minifier', icon: '📦', displayName: 'HTML Minifier', description: 'HTML圧縮', category: 'Code' },
  { path: '/css-formatter', icon: '🎨', displayName: 'CSS Formatter', description: 'CSS整形', category: 'Code' },
  { path: '/css-minifier', icon: '📦', displayName: 'CSS Minifier', description: 'CSS圧縮', category: 'Code' },
  { path: '/scss-formatter', icon: '🎨', displayName: 'SCSS Formatter', description: 'SCSS整形', category: 'Code' },
  { path: '/js-formatter', icon: '📜', displayName: 'JS Formatter', description: 'JavaScript整形', category: 'Code' },
  { path: '/js-minifier', icon: '📦', displayName: 'JS Minifier', description: 'JavaScript圧縮', category: 'Code' },
  { path: '/ts-formatter', icon: '📘', displayName: 'TypeScript Formatter', description: 'TypeScript整形', category: 'Code' },
  { path: '/sql-formatter', icon: '🗃', displayName: 'SQL Formatter', description: 'SQL整形・圧縮', category: 'Code' },
  { path: '/xml-formatter', icon: '📄', displayName: 'XML Formatter', description: 'XML整形・圧縮', category: 'Code' },
  { path: '/yaml-formatter', icon: '📝', displayName: 'YAML Formatter', description: 'YAML整形', category: 'Code' },
  { path: '/graphql-formatter', icon: '◆', displayName: 'GraphQL Formatter', description: 'GraphQL整形・圧縮', category: 'Code' },
  { path: '/syntax-highlight', icon: '🌈', displayName: 'Syntax Highlighter', description: 'シンタックスハイライト', category: 'Code' },
  { path: '/code-diff-viewer', icon: '🔍', displayName: 'Diff Viewer', description: '差分ビューアー', category: 'Code' },
  { path: '/code-http-status', icon: '🌐', displayName: 'HTTP Status', description: 'HTTPステータスコード一覧', category: 'Code' },
  { path: '/code-jwt-decoder', icon: '🔓', displayName: 'JWT Decoder', description: 'JWTデコード', category: 'Code' },
  { path: '/code-regex-tester', icon: '🔎', displayName: 'Regex Tester', description: '正規表現テスト', category: 'Code' },
  { path: '/code-chmod', icon: '🔧', displayName: 'Chmod Calculator', description: 'chmod計算', category: 'Code' },
  { path: '/code-to-image', icon: '📸', displayName: 'Code to Image', description: 'コード→画像変換', category: 'Code' },
  { path: '/docker-compose-converter', icon: '🐳', displayName: 'Docker Run to Compose', description: 'docker run→compose変換', category: 'Code' },
  { path: '/git-cheatsheet', icon: '📖', displayName: 'Git Cheatsheet', description: 'Gitチートシート', category: 'Code' },

  // Color / CSS
  { path: '/color-converter', icon: '🎨', displayName: 'Color Converter', description: 'カラーコード変換', category: 'Color / CSS' },
  { path: '/color-picker', icon: '🖌', displayName: 'Color Picker', description: 'カラーピッカー', category: 'Color / CSS' },
  { path: '/color-mixer', icon: '🎨', displayName: 'Color Mixer', description: 'カラーミキサー', category: 'Color / CSS' },
  { path: '/color-shade', icon: '🌗', displayName: 'Color Shade', description: 'シェード・ティント生成', category: 'Color / CSS' },
  { path: '/color-brightness', icon: '☀', displayName: 'Color Brightness', description: '明度・彩度調整', category: 'Color / CSS' },
  { path: '/color-invert', icon: '🔄', displayName: 'Color Invert', description: '色反転', category: 'Color / CSS' },
  { path: '/color-blind-simulator', icon: '👁', displayName: 'Color Blind Sim', description: '色覚シミュレーション', category: 'Color / CSS' },
  { path: '/css-gradient', icon: '🌈', displayName: 'CSS Gradient', description: 'グラデーション生成', category: 'Color / CSS' },
  { path: '/css-box-shadow', icon: '🔲', displayName: 'CSS Box Shadow', description: 'Box Shadow生成', category: 'Color / CSS' },
  { path: '/css-border-radius', icon: '⬜', displayName: 'CSS Border Radius', description: 'Border Radius生成', category: 'Color / CSS' },
  { path: '/css-glassmorphism', icon: '🪟', displayName: 'Glassmorphism', description: 'Glassmorphism生成', category: 'Color / CSS' },
  { path: '/css-clip-path', icon: '✂', displayName: 'CSS Clip Path', description: 'Clip Path生成', category: 'Color / CSS' },
  { path: '/css-flexbox', icon: '📐', displayName: 'Flexbox Playground', description: 'Flexboxプレイグラウンド', category: 'Color / CSS' },
  { path: '/css-grid', icon: '🔳', displayName: 'CSS Grid', description: 'CSS Gridプレイグラウンド', category: 'Color / CSS' },
  { path: '/css-checkbox', icon: '☑', displayName: 'CSS Checkbox', description: 'Checkbox/Switch生成', category: 'Color / CSS' },
  { path: '/css-loader', icon: '⏳', displayName: 'CSS Loader', description: 'ローディングアニメーション', category: 'Color / CSS' },

  // Image
  { path: '/image-crop', icon: '✂', displayName: 'Image Crop', description: '画像トリミング', category: 'Image' },
  { path: '/image-resize', icon: '📐', displayName: 'Image Resize', description: '画像リサイズ', category: 'Image' },
  { path: '/image-generate', icon: '🎨', displayName: 'Image Generator', description: 'ダミー画像生成', category: 'Image' },
  { path: '/image-grayscale', icon: '⚫', displayName: 'Image Grayscale', description: 'グレースケール変換', category: 'Image' },
  { path: '/image-transparent', icon: '🔍', displayName: 'Image Transparent', description: '画像透過処理', category: 'Image' },
  { path: '/image-trim', icon: '✂', displayName: 'Image Trim', description: '透過余白トリミング', category: 'Image' },
  { path: '/image-assets', icon: '🖼', displayName: 'Image Assets', description: '一括リサイズ', category: 'Image' },
  { path: '/image-compress', icon: '📦', displayName: 'Image Compress', description: '画像圧縮', category: 'Image' },
  { path: '/image-convert', icon: '🔄', displayName: 'Image Convert', description: 'フォーマット変換', category: 'Image' },
  { path: '/image-flip', icon: '🔃', displayName: 'Image Flip', description: '画像反転', category: 'Image' },
  { path: '/image-brightness', icon: '☀', displayName: 'Image Brightness', description: '明度調整', category: 'Image' },
  { path: '/image-filter', icon: '🎭', displayName: 'Image Filter', description: 'フィルター効果', category: 'Image' },
  { path: '/image-color-extract', icon: '🎨', displayName: 'Color Extract', description: '画像色抽出', category: 'Image' },
  { path: '/image-ascii-art', icon: '🔤', displayName: 'ASCII Art', description: 'アスキーアート変換', category: 'Image' },
  { path: '/image-favicon', icon: '⭐', displayName: 'Favicon Generator', description: 'ファビコン生成', category: 'Image' },
  { path: '/image-app-icon', icon: '📱', displayName: 'App Icon', description: 'アプリアイコン生成', category: 'Image' },
  { path: '/image-svg-blob', icon: '💧', displayName: 'SVG Blob', description: 'SVG Blob生成', category: 'Image' },
  { path: '/image-svg-pattern', icon: '🔲', displayName: 'SVG Pattern', description: 'SVGパターン生成', category: 'Image' },
  { path: '/image-svg-placeholder', icon: '🖼', displayName: 'SVG Placeholder', description: 'プレースホルダー生成', category: 'Image' },
  { path: '/image-to-base64', icon: '🔤', displayName: 'Image to Base64', description: 'Base64エンコード', category: 'Image' },
  { path: '/image-ocr', icon: '📖', displayName: 'OCR', description: '画像テキスト抽出', category: 'Image' },
  { path: '/handwriting-converter', icon: '✍', displayName: 'Handwriting', description: '手書き風変換', category: 'Image' },

  // PDF
  { path: '/pdf-merge', icon: '📑', displayName: 'PDF Merge', description: 'PDF結合', category: 'PDF' },
  { path: '/pdf-split', icon: '✂', displayName: 'PDF Split', description: 'PDF分割', category: 'PDF' },
  { path: '/pdf-compress', icon: '📦', displayName: 'PDF Compress', description: 'PDF圧縮', category: 'PDF' },
  { path: '/pdf-rotate', icon: '🔄', displayName: 'PDF Rotate', description: 'ページ回転', category: 'PDF' },
  { path: '/pdf-metadata', icon: 'ℹ', displayName: 'PDF Metadata', description: 'メタデータ編集', category: 'PDF' },
  { path: '/pdf-watermark', icon: '💧', displayName: 'PDF Watermark', description: 'ウォーターマーク', category: 'PDF' },
  { path: '/pdf-password', icon: '🔒', displayName: 'PDF Password', description: 'パスワード保護', category: 'PDF' },
  { path: '/pdf-to-image', icon: '🖼', displayName: 'PDF to Image', description: 'PDF→画像変換', category: 'PDF' },
  { path: '/image-to-pdf', icon: '📄', displayName: 'Image to PDF', description: '画像→PDF変換', category: 'PDF' },

  // Video
  { path: '/video-to-gif', icon: '🎬', displayName: 'Video to GIF', description: '動画→GIF変換', category: 'Video' },
  { path: '/gif-frame-extractor', icon: '🖼', displayName: 'GIF Frame Extractor', description: 'GIFフレーム抽出', category: 'Video' },
  { path: '/screen-recorder', icon: '🎥', displayName: 'Screen Recorder', description: '画面録画', category: 'Video' },
  { path: '/webcam-test', icon: '📷', displayName: 'Webcam Test', description: 'カメラテスト', category: 'Video' },

  // Generator
  { path: '/gen-password', icon: '🔑', displayName: 'Password Generator', description: 'パスワード生成', category: 'Generator' },
  { path: '/gen-uuid', icon: '🆔', displayName: 'UUID Generator', description: 'UUID/ULID生成', category: 'Generator' },
  { path: '/gen-dummy-data', icon: '📋', displayName: 'Dummy Data', description: 'ダミーデータ生成', category: 'Generator' },
  { path: '/gen-htpasswd', icon: '🔐', displayName: 'htpasswd Generator', description: '.htpasswd生成', category: 'Generator' },
  { path: '/bip39-generator', icon: '🌱', displayName: 'BIP39 Generator', description: 'ニーモニック生成', category: 'Generator' },
  { path: '/qr-code-generator', icon: '📱', displayName: 'QR Code Generator', description: 'QRコード生成', category: 'Generator' },
  { path: '/qr-code-reader', icon: '📷', displayName: 'QR Code Reader', description: 'QRコード読取', category: 'Generator' },
  { path: '/barcode-generator', icon: '📊', displayName: 'Barcode Generator', description: 'バーコード生成', category: 'Generator' },
  { path: '/seo-ogp-generator', icon: '🏷', displayName: 'OGP Generator', description: 'OGPメタタグ生成', category: 'Generator' },
  { path: '/morpheme-analyzer', icon: '🔬', displayName: 'Morpheme Analyzer', description: '文字種別分割', category: 'Generator' },
  { path: '/braille-converter', icon: '⠃', displayName: 'Braille Converter', description: '点字変換', category: 'Generator' },

  // Network
  { path: '/cidr-calculator', icon: '🌐', displayName: 'CIDR Calculator', description: 'CIDR計算', category: 'Network' },
  { path: '/subnet-calculator', icon: '🌐', displayName: 'Subnet Calculator', description: 'サブネット計算', category: 'Network' },
  { path: '/display-checker', icon: '🖥', displayName: 'Display Checker', description: '画面情報チェック', category: 'Network' },
  { path: '/validator-html', icon: '✅', displayName: 'HTML Validator', description: 'HTML検証', category: 'Network' },
  { path: '/validator-xml', icon: '✅', displayName: 'XML Validator', description: 'XML検証', category: 'Network' },
  { path: '/validator-password', icon: '🔒', displayName: 'Password Checker', description: 'パスワード強度チェック', category: 'Network' },
  { path: '/csv-to-chart', icon: '📈', displayName: 'CSV to Chart', description: 'CSV→グラフ', category: 'Network' },
  { path: '/csv-to-sql', icon: '🗃', displayName: 'CSV to SQL', description: 'CSV→SQL変換', category: 'Network' },
  { path: '/list-compare', icon: '📋', displayName: 'List Compare', description: 'リスト比較', category: 'Network' },
  { path: '/list-randomize', icon: '🔀', displayName: 'List Randomizer', description: 'リストランダム化', category: 'Network' },
  { path: '/user-agent-parser', icon: '🔎', displayName: 'User Agent Parser', description: 'UA解析', category: 'Network' },
];
