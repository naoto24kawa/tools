/**
 * アプリケーション設定
 *
 * 新規ツールを追加する場合は、該当カテゴリの配列にエントリを追加するだけでOK
 */

export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network';

export interface AppConfig {
  path: `/${string}`;
  url: string;
  icon: string;
  displayName: string;
  description: string;
  category: AppCategory;
}

export const APPS_CONFIG: readonly AppConfig[] = [
  // ── Text ──
  { path: '/text-counter', url: 'https://tools-text-counter.elchika.app', icon: '📝', displayName: 'Text Counter', description: '文字数・単語数・行数をリアルタイムカウント', category: 'Text' },
  { path: '/text-deduplicate', url: 'https://tools-text-deduplicate.elchika.app', icon: '🔀', displayName: 'Text Deduplicate', description: 'テキストの重複行を削除', category: 'Text' },
  { path: '/text-diff-checker', url: 'https://tools-text-diff-checker.elchika.app', icon: '🔍', displayName: 'Text Diff Checker', description: '2つのテキストの差分を比較表示', category: 'Text' },
  { path: '/text-case-converter', url: 'https://tools-text-case-converter.elchika.app', icon: '🔤', displayName: 'Text Case Converter', description: '大文字/小文字変換', category: 'Text' },
  { path: '/text-code-case', url: 'https://tools-text-code-case.elchika.app', icon: '🐍', displayName: 'Code Case Converter', description: 'camelCase, snake_case等の命名規則変換', category: 'Text' },
  { path: '/text-reverse', url: 'https://tools-text-reverse.elchika.app', icon: '🔄', displayName: 'Text Reverse', description: 'テキスト逆順変換', category: 'Text' },
  { path: '/text-sort', url: 'https://tools-text-sort.elchika.app', icon: '📊', displayName: 'Text Sort', description: 'テキスト行ソート', category: 'Text' },
  { path: '/text-replace', url: 'https://tools-text-replace.elchika.app', icon: '🔁', displayName: 'Text Replace', description: 'テキスト検索・置換', category: 'Text' },
  { path: '/text-line-number', url: 'https://tools-text-line-number.elchika.app', icon: '🔢', displayName: 'Line Number', description: '行番号付与', category: 'Text' },
  { path: '/text-prefix-suffix', url: 'https://tools-text-prefix-suffix.elchika.app', icon: '📎', displayName: 'Prefix Suffix', description: 'プレフィックス・サフィックス追加', category: 'Text' },
  { path: '/text-slugify', url: 'https://tools-text-slugify.elchika.app', icon: '🔗', displayName: 'Slugify', description: 'URLスラッグ生成', category: 'Text' },
  { path: '/text-lorem-ipsum', url: 'https://tools-text-lorem-ipsum.elchika.app', icon: '📄', displayName: 'Lorem Ipsum', description: 'ダミーテキスト生成', category: 'Text' },
  { path: '/text-word-frequency', url: 'https://tools-text-word-frequency.elchika.app', icon: '📈', displayName: 'Word Frequency', description: '単語出現頻度解析', category: 'Text' },
  { path: '/text-fullwidth-halfwidth', url: 'https://tools-text-fullwidth-halfwidth.elchika.app', icon: 'Ａ', displayName: 'Fullwidth Halfwidth', description: '全角・半角変換', category: 'Text' },
  { path: '/text-kana-converter', url: 'https://tools-text-kana-converter.elchika.app', icon: 'あ', displayName: 'Kana Converter', description: 'ひらがな・カタカナ変換', category: 'Text' },
  { path: '/text-bionic-reading', url: 'https://tools-text-bionic-reading.elchika.app', icon: '👁', displayName: 'Bionic Reading', description: 'Bionic Reading変換', category: 'Text' },
  { path: '/text-markdown-html', url: 'https://tools-text-markdown-html.elchika.app', icon: '📑', displayName: 'Markdown to HTML', description: 'Markdown→HTML変換', category: 'Text' },
  { path: '/text-markdown-preview', url: 'https://tools-text-markdown-preview.elchika.app', icon: '👀', displayName: 'Markdown Preview', description: 'Markdownプレビュー', category: 'Text' },

  // ── Encode ──
  { path: '/url-encoder', url: 'https://tools-url-encoder.elchika.app', icon: '🔗', displayName: 'URL Encoder', description: 'URLエンコード・デコード', category: 'Encode' },
  { path: '/encode-base64-string', url: 'https://tools-encode-base64-string.elchika.app', icon: '🔤', displayName: 'Base64 Encoder', description: 'Base64文字列エンコード・デコード', category: 'Encode' },
  { path: '/encode-base64-file', url: 'https://tools-encode-base64-file.elchika.app', icon: '📁', displayName: 'Base64 File', description: 'ファイルBase64変換', category: 'Encode' },
  { path: '/encode-base32', url: 'https://tools-encode-base32.elchika.app', icon: '🔡', displayName: 'Base32 Encoder', description: 'Base32エンコード・デコード', category: 'Encode' },
  { path: '/encode-binary', url: 'https://tools-encode-binary.elchika.app', icon: '💻', displayName: 'Binary Converter', description: 'テキスト-バイナリ変換', category: 'Encode' },
  { path: '/encode-html-entity', url: 'https://tools-encode-html-entity.elchika.app', icon: '&', displayName: 'HTML Entity', description: 'HTMLエンティティ変換', category: 'Encode' },
  { path: '/encode-morse', url: 'https://tools-encode-morse.elchika.app', icon: '📡', displayName: 'Morse Code', description: 'モールス符号変換', category: 'Encode' },
  { path: '/encode-punycode', url: 'https://tools-encode-punycode.elchika.app', icon: '🌐', displayName: 'Punycode', description: 'Punycode変換', category: 'Encode' },
  { path: '/encode-unicode', url: 'https://tools-encode-unicode.elchika.app', icon: '🔣', displayName: 'Unicode Escape', description: 'Unicodeエスケープ変換', category: 'Encode' },
  { path: '/uuencode', url: 'https://tools-uuencode.elchika.app', icon: '📦', displayName: 'UUEncode', description: 'UUEncode/UUDecode', category: 'Encode' },

  // ── Crypto ──
  { path: '/hash-md5', url: 'https://tools-hash-md5.elchika.app', icon: '#', displayName: 'MD5 Hash', description: 'MD5ハッシュ生成', category: 'Crypto' },
  { path: '/hash-sha1', url: 'https://tools-hash-sha1.elchika.app', icon: '#', displayName: 'SHA-1 Hash', description: 'SHA-1ハッシュ生成', category: 'Crypto' },
  { path: '/hash-sha256', url: 'https://tools-hash-sha256.elchika.app', icon: '#', displayName: 'SHA Hash', description: 'SHA-256/384/512ハッシュ生成', category: 'Crypto' },
  { path: '/hash-crc32', url: 'https://tools-hash-crc32.elchika.app', icon: '✅', displayName: 'CRC32', description: 'CRC32チェックサム', category: 'Crypto' },
  { path: '/hash-hmac', url: 'https://tools-hash-hmac.elchika.app', icon: '🔑', displayName: 'HMAC Generator', description: 'HMAC認証コード生成', category: 'Crypto' },
  { path: '/aes-encrypt', url: 'https://tools-aes-encrypt.elchika.app', icon: '🔐', displayName: 'AES Encrypt', description: 'AES-256-GCM暗号化・復号化', category: 'Crypto' },
  { path: '/des-encrypt', url: 'https://tools-des-encrypt.elchika.app', icon: '🔐', displayName: 'DES Encrypt', description: 'Triple DES暗号化・復号化', category: 'Crypto' },
  { path: '/bcrypt-hash', url: 'https://tools-bcrypt-hash.elchika.app', icon: '🔒', displayName: 'Bcrypt Hash', description: 'Bcryptハッシュ生成・検証', category: 'Crypto' },
  { path: '/rsa-keygen', url: 'https://tools-rsa-keygen.elchika.app', icon: '🗝', displayName: 'RSA Key Generator', description: 'RSA鍵ペア生成', category: 'Crypto' },
  { path: '/crypto-caesar', url: 'https://tools-crypto-caesar.elchika.app', icon: '🏛', displayName: 'Caesar Cipher', description: 'シーザー暗号', category: 'Crypto' },
  { path: '/crypto-rot13', url: 'https://tools-crypto-rot13.elchika.app', icon: '🔄', displayName: 'ROT13', description: 'ROT13変換', category: 'Crypto' },
  { path: '/crypto-vigenere', url: 'https://tools-crypto-vigenere.elchika.app', icon: '📜', displayName: 'Vigenere Cipher', description: 'ヴィジュネル暗号', category: 'Crypto' },
  { path: '/crypto-atbash', url: 'https://tools-crypto-atbash.elchika.app', icon: '🪞', displayName: 'Atbash Cipher', description: 'アトバシュ暗号', category: 'Crypto' },
  { path: '/crypto-affine', url: 'https://tools-crypto-affine.elchika.app', icon: '🔢', displayName: 'Affine Cipher', description: 'アフィン暗号', category: 'Crypto' },
  { path: '/crypto-rail-fence', url: 'https://tools-crypto-rail-fence.elchika.app', icon: '🚂', displayName: 'Rail Fence Cipher', description: 'レールフェンス暗号', category: 'Crypto' },
  { path: '/enigma-cipher', url: 'https://tools-enigma-cipher.elchika.app', icon: '⚙', displayName: 'Enigma Cipher', description: 'Enigma暗号シミュレーター', category: 'Crypto' },

  // ── Number ──
  { path: '/number-base-converter', url: 'https://tools-number-base-converter.elchika.app', icon: '🔢', displayName: 'Base Converter', description: '2進/8進/10進/16進数変換', category: 'Number' },
  { path: '/number-fraction', url: 'https://tools-number-fraction.elchika.app', icon: '➗', displayName: 'Fraction', description: '小数→分数変換', category: 'Number' },
  { path: '/number-kanji', url: 'https://tools-number-kanji.elchika.app', icon: '漢', displayName: 'Kanji Number', description: '漢数字変換', category: 'Number' },
  { path: '/math-calculator', url: 'https://tools-math-calculator.elchika.app', icon: '🧮', displayName: 'Calculator', description: '電卓', category: 'Number' },
  { path: '/math-percentage', url: 'https://tools-math-percentage.elchika.app', icon: '%', displayName: 'Percentage', description: '割合・パーセント計算', category: 'Number' },
  { path: '/math-statistics', url: 'https://tools-math-statistics.elchika.app', icon: '📊', displayName: 'Statistics', description: '統計計算', category: 'Number' },
  { path: '/math-area', url: 'https://tools-math-area.elchika.app', icon: '📐', displayName: 'Area Calculator', description: '面積計算', category: 'Number' },
  { path: '/unit-converter', url: 'https://tools-unit-converter.elchika.app', icon: '⚖', displayName: 'Unit Converter', description: '単位変換', category: 'Number' },
  { path: '/random-number', url: 'https://tools-random-number.elchika.app', icon: '🎲', displayName: 'Random Number', description: '乱数生成', category: 'Number' },
  { path: '/random-dice', url: 'https://tools-random-dice.elchika.app', icon: '🎲', displayName: 'Dice Roller', description: 'サイコロシミュレーター', category: 'Number' },
  { path: '/random-coin', url: 'https://tools-random-coin.elchika.app', icon: '🪙', displayName: 'Coin Flip', description: 'コイン投げシミュレーター', category: 'Number' },

  // ── DateTime ──
  { path: '/datetime-unix', url: 'https://tools-datetime-unix.elchika.app', icon: '🕐', displayName: 'Unix Timestamp', description: 'UNIXタイムスタンプ変換', category: 'DateTime' },
  { path: '/datetime-iso8601', url: 'https://tools-datetime-iso8601.elchika.app', icon: '📅', displayName: 'ISO 8601', description: 'ISO 8601形式変換', category: 'DateTime' },
  { path: '/datetime-rfc2822', url: 'https://tools-datetime-rfc2822.elchika.app', icon: '📧', displayName: 'RFC 2822', description: 'RFC 2822形式変換', category: 'DateTime' },
  { path: '/datetime-diff', url: 'https://tools-datetime-diff.elchika.app', icon: '📏', displayName: 'Date Diff', description: '日付差分計算', category: 'DateTime' },
  { path: '/datetime-wareki', url: 'https://tools-datetime-wareki.elchika.app', icon: '🏯', displayName: 'Wareki Converter', description: '和暦変換', category: 'DateTime' },
  { path: '/datetime-world-clock', url: 'https://tools-datetime-world-clock.elchika.app', icon: '🌍', displayName: 'World Clock', description: '世界時計', category: 'DateTime' },
  { path: '/datetime-countdown', url: 'https://tools-datetime-countdown.elchika.app', icon: '⏳', displayName: 'Countdown', description: 'カウントダウン', category: 'DateTime' },
  { path: '/datetime-timer', url: 'https://tools-datetime-timer.elchika.app', icon: '⏱', displayName: 'Timer', description: 'タイマー', category: 'DateTime' },
  { path: '/datetime-stopwatch', url: 'https://tools-datetime-stopwatch.elchika.app', icon: '⏱', displayName: 'Stopwatch', description: 'ストップウォッチ', category: 'DateTime' },
  { path: '/datetime-crontab', url: 'https://tools-datetime-crontab.elchika.app', icon: '⚙', displayName: 'Crontab', description: 'Cron式生成・パース', category: 'DateTime' },
  { path: '/datetime-eta', url: 'https://tools-datetime-eta.elchika.app', icon: '🚀', displayName: 'ETA Calculator', description: '到着予想時刻計算', category: 'DateTime' },

  // ── JSON ──
  { path: '/json-formatter', url: 'https://tools-json-formatter.elchika.app', icon: '{}', displayName: 'JSON Formatter', description: 'JSON整形', category: 'JSON' },
  { path: '/json-minify', url: 'https://tools-json-minify.elchika.app', icon: '📦', displayName: 'JSON Minify', description: 'JSON圧縮', category: 'JSON' },
  { path: '/json-validator', url: 'https://tools-json-validator.elchika.app', icon: '✅', displayName: 'JSON Validator', description: 'JSON検証', category: 'JSON' },
  { path: '/json-viewer', url: 'https://tools-json-viewer.elchika.app', icon: '🌳', displayName: 'JSON Viewer', description: 'JSONツリービュー', category: 'JSON' },
  { path: '/json-editor', url: 'https://tools-json-editor.elchika.app', icon: '✏', displayName: 'JSON Editor', description: 'JSONエディタ', category: 'JSON' },
  { path: '/json-diff', url: 'https://tools-json-diff.elchika.app', icon: '🔍', displayName: 'JSON Diff', description: 'JSON差分比較', category: 'JSON' },
  { path: '/json-to-csv', url: 'https://tools-json-to-csv.elchika.app', icon: '📊', displayName: 'JSON to CSV', description: 'JSON→CSV変換', category: 'JSON' },
  { path: '/json-to-yaml', url: 'https://tools-json-to-yaml.elchika.app', icon: '📝', displayName: 'JSON to YAML', description: 'JSON→YAML変換', category: 'JSON' },
  { path: '/json-to-xml', url: 'https://tools-json-to-xml.elchika.app', icon: '📄', displayName: 'JSON to XML', description: 'JSON→XML変換', category: 'JSON' },
  { path: '/json-to-toml', url: 'https://tools-json-to-toml.elchika.app', icon: '⚙', displayName: 'JSON to TOML', description: 'JSON→TOML変換', category: 'JSON' },
  { path: '/json-to-table', url: 'https://tools-json-to-table.elchika.app', icon: '📋', displayName: 'JSON to Table', description: 'JSON→テーブル変換', category: 'JSON' },
  { path: '/jsonpath-tester', url: 'https://tools-jsonpath-tester.elchika.app', icon: '🎯', displayName: 'JSONPath Tester', description: 'JSONPath式テスト', category: 'JSON' },

  // ── Code ──
  { path: '/html-formatter', url: 'https://tools-html-formatter.elchika.app', icon: '🌐', displayName: 'HTML Formatter', description: 'HTML整形', category: 'Code' },
  { path: '/html-minifier', url: 'https://tools-html-minifier.elchika.app', icon: '📦', displayName: 'HTML Minifier', description: 'HTML圧縮', category: 'Code' },
  { path: '/css-formatter', url: 'https://tools-css-formatter.elchika.app', icon: '🎨', displayName: 'CSS Formatter', description: 'CSS整形', category: 'Code' },
  { path: '/css-minifier', url: 'https://tools-css-minifier.elchika.app', icon: '📦', displayName: 'CSS Minifier', description: 'CSS圧縮', category: 'Code' },
  { path: '/scss-formatter', url: 'https://tools-scss-formatter.elchika.app', icon: '🎨', displayName: 'SCSS Formatter', description: 'SCSS整形', category: 'Code' },
  { path: '/js-formatter', url: 'https://tools-js-formatter.elchika.app', icon: '📜', displayName: 'JS Formatter', description: 'JavaScript整形', category: 'Code' },
  { path: '/js-minifier', url: 'https://tools-js-minifier.elchika.app', icon: '📦', displayName: 'JS Minifier', description: 'JavaScript圧縮', category: 'Code' },
  { path: '/ts-formatter', url: 'https://tools-ts-formatter.elchika.app', icon: '📘', displayName: 'TypeScript Formatter', description: 'TypeScript整形', category: 'Code' },
  { path: '/sql-formatter', url: 'https://tools-sql-formatter.elchika.app', icon: '🗃', displayName: 'SQL Formatter', description: 'SQL整形・圧縮', category: 'Code' },
  { path: '/xml-formatter', url: 'https://tools-xml-formatter.elchika.app', icon: '📄', displayName: 'XML Formatter', description: 'XML整形・圧縮', category: 'Code' },
  { path: '/yaml-formatter', url: 'https://tools-yaml-formatter.elchika.app', icon: '📝', displayName: 'YAML Formatter', description: 'YAML整形', category: 'Code' },
  { path: '/graphql-formatter', url: 'https://tools-graphql-formatter.elchika.app', icon: '◆', displayName: 'GraphQL Formatter', description: 'GraphQL整形・圧縮', category: 'Code' },
  { path: '/syntax-highlight', url: 'https://tools-syntax-highlight.elchika.app', icon: '🌈', displayName: 'Syntax Highlighter', description: 'シンタックスハイライト', category: 'Code' },
  { path: '/code-diff-viewer', url: 'https://tools-code-diff-viewer.elchika.app', icon: '🔍', displayName: 'Diff Viewer', description: '差分ビューアー', category: 'Code' },
  { path: '/code-http-status', url: 'https://tools-code-http-status.elchika.app', icon: '🌐', displayName: 'HTTP Status', description: 'HTTPステータスコード一覧', category: 'Code' },
  { path: '/code-jwt-decoder', url: 'https://tools-code-jwt-decoder.elchika.app', icon: '🔓', displayName: 'JWT Decoder', description: 'JWTデコード', category: 'Code' },
  { path: '/code-regex-tester', url: 'https://tools-code-regex-tester.elchika.app', icon: '🔎', displayName: 'Regex Tester', description: '正規表現テスト', category: 'Code' },
  { path: '/code-chmod', url: 'https://tools-code-chmod.elchika.app', icon: '🔧', displayName: 'Chmod Calculator', description: 'chmod計算', category: 'Code' },
  { path: '/code-to-image', url: 'https://tools-code-to-image.elchika.app', icon: '📸', displayName: 'Code to Image', description: 'コード→画像変換', category: 'Code' },
  { path: '/docker-compose-converter', url: 'https://tools-docker-compose-converter.elchika.app', icon: '🐳', displayName: 'Docker Run to Compose', description: 'docker run→compose変換', category: 'Code' },
  { path: '/git-cheatsheet', url: 'https://tools-git-cheatsheet.elchika.app', icon: '📖', displayName: 'Git Cheatsheet', description: 'Gitチートシート', category: 'Code' },

  // ── Color / CSS ──
  { path: '/color-converter', url: 'https://tools-color-converter.elchika.app', icon: '🎨', displayName: 'Color Converter', description: 'カラーコード変換', category: 'Color / CSS' },
  { path: '/color-picker', url: 'https://tools-color-picker.elchika.app', icon: '🖌', displayName: 'Color Picker', description: 'カラーピッカー', category: 'Color / CSS' },
  { path: '/color-mixer', url: 'https://tools-color-mixer.elchika.app', icon: '🎨', displayName: 'Color Mixer', description: 'カラーミキサー', category: 'Color / CSS' },
  { path: '/color-shade', url: 'https://tools-color-shade.elchika.app', icon: '🌗', displayName: 'Color Shade', description: 'シェード・ティント生成', category: 'Color / CSS' },
  { path: '/color-brightness', url: 'https://tools-color-brightness.elchika.app', icon: '☀', displayName: 'Color Brightness', description: '明度・彩度調整', category: 'Color / CSS' },
  { path: '/color-invert', url: 'https://tools-color-invert.elchika.app', icon: '🔄', displayName: 'Color Invert', description: '色反転', category: 'Color / CSS' },
  { path: '/color-blind-simulator', url: 'https://tools-color-blind-simulator.elchika.app', icon: '👁', displayName: 'Color Blind Sim', description: '色覚シミュレーション', category: 'Color / CSS' },
  { path: '/css-gradient', url: 'https://tools-css-gradient.elchika.app', icon: '🌈', displayName: 'CSS Gradient', description: 'グラデーション生成', category: 'Color / CSS' },
  { path: '/css-box-shadow', url: 'https://tools-css-box-shadow.elchika.app', icon: '🔲', displayName: 'CSS Box Shadow', description: 'Box Shadow生成', category: 'Color / CSS' },
  { path: '/css-border-radius', url: 'https://tools-css-border-radius.elchika.app', icon: '⬜', displayName: 'CSS Border Radius', description: 'Border Radius生成', category: 'Color / CSS' },
  { path: '/css-glassmorphism', url: 'https://tools-css-glassmorphism.elchika.app', icon: '🪟', displayName: 'Glassmorphism', description: 'Glassmorphism生成', category: 'Color / CSS' },
  { path: '/css-clip-path', url: 'https://tools-css-clip-path.elchika.app', icon: '✂', displayName: 'CSS Clip Path', description: 'Clip Path生成', category: 'Color / CSS' },
  { path: '/css-flexbox', url: 'https://tools-css-flexbox.elchika.app', icon: '📐', displayName: 'Flexbox Playground', description: 'Flexboxプレイグラウンド', category: 'Color / CSS' },
  { path: '/css-grid', url: 'https://tools-css-grid.elchika.app', icon: '🔳', displayName: 'CSS Grid', description: 'CSS Gridプレイグラウンド', category: 'Color / CSS' },
  { path: '/css-checkbox', url: 'https://tools-css-checkbox.elchika.app', icon: '☑', displayName: 'CSS Checkbox', description: 'Checkbox/Switch生成', category: 'Color / CSS' },
  { path: '/css-loader', url: 'https://tools-css-loader.elchika.app', icon: '⏳', displayName: 'CSS Loader', description: 'ローディングアニメーション', category: 'Color / CSS' },

  // ── Image ──
  { path: '/image-crop', url: 'https://tools-image-crop.elchika.app', icon: '✂', displayName: 'Image Crop', description: '画像トリミング', category: 'Image' },
  { path: '/image-resize', url: 'https://tools-image-resize.elchika.app', icon: '📐', displayName: 'Image Resize', description: '画像リサイズ', category: 'Image' },
  { path: '/image-generate', url: 'https://tools-image-generate.elchika.app', icon: '🎨', displayName: 'Image Generator', description: 'ダミー画像生成', category: 'Image' },
  { path: '/image-grayscale', url: 'https://tools-image-grayscale.elchika.app', icon: '⚫', displayName: 'Image Grayscale', description: 'グレースケール変換', category: 'Image' },
  { path: '/image-transparent', url: 'https://tools-image-transparent.elchika.app', icon: '🔍', displayName: 'Image Transparent', description: '画像透過処理', category: 'Image' },
  { path: '/image-trim', url: 'https://tools-image-trim.elchika.app', icon: '✂', displayName: 'Image Trim', description: '透過余白トリミング', category: 'Image' },
  { path: '/image-assets', url: 'https://tools-image-assets.elchika.app', icon: '🖼', displayName: 'Image Assets', description: '一括リサイズ', category: 'Image' },
  { path: '/image-compress', url: 'https://tools-image-compress.elchika.app', icon: '📦', displayName: 'Image Compress', description: '画像圧縮', category: 'Image' },
  { path: '/image-convert', url: 'https://tools-image-convert.elchika.app', icon: '🔄', displayName: 'Image Convert', description: 'フォーマット変換', category: 'Image' },
  { path: '/image-flip', url: 'https://tools-image-flip.elchika.app', icon: '🔃', displayName: 'Image Flip', description: '画像反転', category: 'Image' },
  { path: '/image-brightness', url: 'https://tools-image-brightness.elchika.app', icon: '☀', displayName: 'Image Brightness', description: '明度調整', category: 'Image' },
  { path: '/image-filter', url: 'https://tools-image-filter.elchika.app', icon: '🎭', displayName: 'Image Filter', description: 'フィルター効果', category: 'Image' },
  { path: '/image-color-extract', url: 'https://tools-image-color-extract.elchika.app', icon: '🎨', displayName: 'Color Extract', description: '画像色抽出', category: 'Image' },
  { path: '/image-ascii-art', url: 'https://tools-image-ascii-art.elchika.app', icon: '🔤', displayName: 'ASCII Art', description: 'アスキーアート変換', category: 'Image' },
  { path: '/image-favicon', url: 'https://tools-image-favicon.elchika.app', icon: '⭐', displayName: 'Favicon Generator', description: 'ファビコン生成', category: 'Image' },
  { path: '/image-app-icon', url: 'https://tools-image-app-icon.elchika.app', icon: '📱', displayName: 'App Icon', description: 'アプリアイコン生成', category: 'Image' },
  { path: '/image-svg-blob', url: 'https://tools-image-svg-blob.elchika.app', icon: '💧', displayName: 'SVG Blob', description: 'SVG Blob生成', category: 'Image' },
  { path: '/image-svg-pattern', url: 'https://tools-image-svg-pattern.elchika.app', icon: '🔲', displayName: 'SVG Pattern', description: 'SVGパターン生成', category: 'Image' },
  { path: '/image-svg-placeholder', url: 'https://tools-image-svg-placeholder.elchika.app', icon: '🖼', displayName: 'SVG Placeholder', description: 'プレースホルダー生成', category: 'Image' },
  { path: '/image-to-base64', url: 'https://tools-image-to-base64.elchika.app', icon: '🔤', displayName: 'Image to Base64', description: 'Base64エンコード', category: 'Image' },
  { path: '/image-ocr', url: 'https://tools-image-ocr.elchika.app', icon: '📖', displayName: 'OCR', description: '画像テキスト抽出', category: 'Image' },
  { path: '/handwriting-converter', url: 'https://tools-handwriting-converter.elchika.app', icon: '✍', displayName: 'Handwriting', description: '手書き風変換', category: 'Image' },

  // ── PDF ──
  { path: '/pdf-merge', url: 'https://tools-pdf-merge.elchika.app', icon: '📑', displayName: 'PDF Merge', description: 'PDF結合', category: 'PDF' },
  { path: '/pdf-split', url: 'https://tools-pdf-split.elchika.app', icon: '✂', displayName: 'PDF Split', description: 'PDF分割', category: 'PDF' },
  { path: '/pdf-compress', url: 'https://tools-pdf-compress.elchika.app', icon: '📦', displayName: 'PDF Compress', description: 'PDF圧縮', category: 'PDF' },
  { path: '/pdf-rotate', url: 'https://tools-pdf-rotate.elchika.app', icon: '🔄', displayName: 'PDF Rotate', description: 'ページ回転', category: 'PDF' },
  { path: '/pdf-metadata', url: 'https://tools-pdf-metadata.elchika.app', icon: 'ℹ', displayName: 'PDF Metadata', description: 'メタデータ編集', category: 'PDF' },
  { path: '/pdf-watermark', url: 'https://tools-pdf-watermark.elchika.app', icon: '💧', displayName: 'PDF Watermark', description: 'ウォーターマーク', category: 'PDF' },
  { path: '/pdf-password', url: 'https://tools-pdf-password.elchika.app', icon: '🔒', displayName: 'PDF Password', description: 'パスワード保護', category: 'PDF' },
  { path: '/pdf-to-image', url: 'https://tools-pdf-to-image.elchika.app', icon: '🖼', displayName: 'PDF to Image', description: 'PDF→画像変換', category: 'PDF' },
  { path: '/image-to-pdf', url: 'https://tools-image-to-pdf.elchika.app', icon: '📄', displayName: 'Image to PDF', description: '画像→PDF変換', category: 'PDF' },

  // ── Video ──
  { path: '/video-to-gif', url: 'https://tools-video-to-gif.elchika.app', icon: '🎬', displayName: 'Video to GIF', description: '動画→GIF変換', category: 'Video' },
  { path: '/gif-frame-extractor', url: 'https://tools-gif-frame-extractor.elchika.app', icon: '🖼', displayName: 'GIF Frame Extractor', description: 'GIFフレーム抽出', category: 'Video' },
  { path: '/screen-recorder', url: 'https://tools-screen-recorder.elchika.app', icon: '🎥', displayName: 'Screen Recorder', description: '画面録画', category: 'Video' },
  { path: '/webcam-test', url: 'https://tools-webcam-test.elchika.app', icon: '📷', displayName: 'Webcam Test', description: 'カメラテスト', category: 'Video' },

  // ── Generator ──
  { path: '/gen-password', url: 'https://tools-gen-password.elchika.app', icon: '🔑', displayName: 'Password Generator', description: 'パスワード生成', category: 'Generator' },
  { path: '/password-generator', url: 'https://tools-password-generator.elchika.app', icon: '🔑', displayName: 'Password Generator', description: 'パスワード生成', category: 'Generator' },
  { path: '/gen-uuid', url: 'https://tools-gen-uuid.elchika.app', icon: '🆔', displayName: 'UUID Generator', description: 'UUID/ULID生成', category: 'Generator' },
  { path: '/uuid-generator', url: 'https://tools-uuid-generator.elchika.app', icon: '🆔', displayName: 'UUID/ULID Generator', description: 'UUID/ULID生成', category: 'Generator' },
  { path: '/gen-dummy-data', url: 'https://tools-gen-dummy-data.elchika.app', icon: '📋', displayName: 'Dummy Data', description: 'ダミーデータ生成', category: 'Generator' },
  { path: '/dummy-data-generator', url: 'https://tools-dummy-data-generator.elchika.app', icon: '📋', displayName: 'Dummy Data Generator', description: 'ダミーデータ生成', category: 'Generator' },
  { path: '/gen-htpasswd', url: 'https://tools-gen-htpasswd.elchika.app', icon: '🔐', displayName: 'htpasswd Generator', description: '.htpasswd生成', category: 'Generator' },
  { path: '/htpasswd-generator', url: 'https://tools-htpasswd-generator.elchika.app', icon: '🔐', displayName: '.htpasswd Generator', description: '.htpasswd生成', category: 'Generator' },
  { path: '/bip39-generator', url: 'https://tools-bip39-generator.elchika.app', icon: '🌱', displayName: 'BIP39 Generator', description: 'ニーモニック生成', category: 'Generator' },
  { path: '/qr-code-generator', url: 'https://tools-qr-code-generator.elchika.app', icon: '📱', displayName: 'QR Code Generator', description: 'QRコード生成', category: 'Generator' },
  { path: '/qr-code-reader', url: 'https://tools-qr-code-reader.elchika.app', icon: '📷', displayName: 'QR Code Reader', description: 'QRコード読取', category: 'Generator' },
  { path: '/barcode-generator', url: 'https://tools-barcode-generator.elchika.app', icon: '📊', displayName: 'Barcode Generator', description: 'バーコード生成', category: 'Generator' },
  { path: '/seo-ogp-generator', url: 'https://tools-seo-ogp-generator.elchika.app', icon: '🏷', displayName: 'OGP Generator', description: 'OGPメタタグ生成', category: 'Generator' },
  { path: '/morpheme-analyzer', url: 'https://tools-morpheme-analyzer.elchika.app', icon: '🔬', displayName: 'Morpheme Analyzer', description: '文字種別分割', category: 'Generator' },
  { path: '/braille-converter', url: 'https://tools-braille-converter.elchika.app', icon: '⠃', displayName: 'Braille Converter', description: '点字変換', category: 'Generator' },

  // ── Network / Misc ──
  { path: '/cidr-calculator', url: 'https://tools-cidr-calculator.elchika.app', icon: '🌐', displayName: 'CIDR Calculator', description: 'CIDR計算', category: 'Network' },
  { path: '/subnet-calculator', url: 'https://tools-subnet-calculator.elchika.app', icon: '🌐', displayName: 'Subnet Calculator', description: 'サブネット計算', category: 'Network' },
  { path: '/network-subnet', url: 'https://tools-network-subnet.elchika.app', icon: '🌐', displayName: 'Network Subnet', description: 'サブネット計算', category: 'Network' },
  { path: '/network-user-agent', url: 'https://tools-network-user-agent.elchika.app', icon: '🔎', displayName: 'User Agent Parser', description: 'UA解析', category: 'Network' },
  { path: '/user-agent-parser', url: 'https://tools-user-agent-parser.elchika.app', icon: '🔎', displayName: 'User Agent Parser', description: 'UA解析', category: 'Network' },
  { path: '/display-checker', url: 'https://tools-display-checker.elchika.app', icon: '🖥', displayName: 'Display Checker', description: '画面情報チェック', category: 'Network' },
  { path: '/validator-html', url: 'https://tools-validator-html.elchika.app', icon: '✅', displayName: 'HTML Validator', description: 'HTML検証', category: 'Network' },
  { path: '/validator-xml', url: 'https://tools-validator-xml.elchika.app', icon: '✅', displayName: 'XML Validator', description: 'XML検証', category: 'Network' },
  { path: '/validator-password', url: 'https://tools-validator-password.elchika.app', icon: '🔒', displayName: 'Password Checker', description: 'パスワード強度チェック', category: 'Network' },
  { path: '/csv-to-chart', url: 'https://tools-csv-to-chart.elchika.app', icon: '📈', displayName: 'CSV to Chart', description: 'CSV→グラフ', category: 'Network' },
  { path: '/csv-to-sql', url: 'https://tools-csv-to-sql.elchika.app', icon: '🗃', displayName: 'CSV to SQL', description: 'CSV→SQL変換', category: 'Network' },
  { path: '/list-compare', url: 'https://tools-list-compare.elchika.app', icon: '📋', displayName: 'List Compare', description: 'リスト比較', category: 'Network' },
  { path: '/list-randomize', url: 'https://tools-list-randomize.elchika.app', icon: '🔀', displayName: 'List Randomizer', description: 'リストランダム化', category: 'Network' },
];

/**
 * システムパス(ヘルスチェックなど)
 */
export const SYSTEM_PATHS = ['/', '/health'] as const;

/**
 * 利用可能な全パス
 */
export const AVAILABLE_PATHS = [...SYSTEM_PATHS, ...APPS_CONFIG.map((app) => app.path)] as const;

