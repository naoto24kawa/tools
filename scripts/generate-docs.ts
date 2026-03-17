#!/usr/bin/env bun
/**
 * 各 apps/* ディレクトリに README.md と CLAUDE.md を一括生成するスクリプト
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const APPS_DIR = join(import.meta.dir, '..', 'apps');
const BASE_URL = 'https://tools.elchika.app';

// ── アプリ名 → 正しいタイトル・説明のマッピング ──
const APP_META: Record<string, { title: string; descJa: string; category: string }> = {
  // Text
  'text-counter': { title: 'Text Counter', descJa: '文字数・単語数・行数をリアルタイムカウント', category: 'Text' },
  'text-deduplicate': { title: 'Text Deduplicate', descJa: 'テキストの重複行を削除', category: 'Text' },
  'text-diff-checker': { title: 'Text Diff Checker', descJa: '2つのテキストの差分を比較表示', category: 'Text' },
  'text-case-converter': { title: 'Text Case Converter', descJa: 'テキストの大文字/小文字を変換', category: 'Text' },
  'text-code-case': { title: 'Code Case Converter', descJa: 'プログラミング用命名規則(camelCase, snake_case等)を変換', category: 'Text' },
  'text-reverse': { title: 'Text Reverse', descJa: 'テキストを逆順に変換', category: 'Text' },
  'text-sort': { title: 'Text Sort', descJa: 'テキスト行をソート', category: 'Text' },
  'text-replace': { title: 'Text Replace', descJa: 'テキストの検索・置換', category: 'Text' },
  'text-line-number': { title: 'Line Number', descJa: 'テキストに行番号を付与', category: 'Text' },
  'text-prefix-suffix': { title: 'Prefix Suffix', descJa: '各行にプレフィックス・サフィックスを追加', category: 'Text' },
  'text-slugify': { title: 'Slugify', descJa: 'テキストをURLスラッグに変換', category: 'Text' },
  'text-lorem-ipsum': { title: 'Lorem Ipsum Generator', descJa: 'ダミーテキスト(Lorem Ipsum)を生成', category: 'Text' },
  'text-word-frequency': { title: 'Word Frequency', descJa: 'テキスト内の単語出現頻度を解析', category: 'Text' },
  'text-fullwidth-halfwidth': { title: 'Fullwidth Halfwidth', descJa: '全角・半角を相互変換', category: 'Text' },
  'text-kana-converter': { title: 'Kana Converter', descJa: 'ひらがな・カタカナを相互変換', category: 'Text' },
  'text-bionic-reading': { title: 'Bionic Reading', descJa: 'テキストをBionic Reading形式に変換', category: 'Text' },
  'text-markdown-html': { title: 'Markdown to HTML', descJa: 'MarkdownをHTMLに変換', category: 'Text' },
  'text-markdown-preview': { title: 'Markdown Preview', descJa: 'Markdownをリアルタイムプレビュー', category: 'Text' },

  // Encode
  'url-encoder': { title: 'URL Encoder', descJa: 'URLエンコード・デコード', category: 'Encode' },
  'encode-base64-string': { title: 'Base64 Encoder', descJa: 'Base64文字列エンコード・デコード', category: 'Encode' },
  'encode-base64-file': { title: 'Base64 File', descJa: 'ファイルのBase64エンコード・デコード', category: 'Encode' },
  'encode-base32': { title: 'Base32 Encoder', descJa: 'Base32エンコード・デコード', category: 'Encode' },
  'encode-binary': { title: 'Binary Converter', descJa: 'テキストとバイナリの相互変換', category: 'Encode' },
  'encode-html-entity': { title: 'HTML Entity', descJa: 'HTMLエンティティのエンコード・デコード', category: 'Encode' },
  'encode-morse': { title: 'Morse Code', descJa: 'モールス符号の変換', category: 'Encode' },
  'encode-punycode': { title: 'Punycode', descJa: 'Punycode(国際化ドメイン)の変換', category: 'Encode' },
  'encode-unicode': { title: 'Unicode Escape', descJa: 'Unicodeエスケープシーケンスの変換', category: 'Encode' },
  'uuencode': { title: 'UUEncode', descJa: 'UUEncode/UUDecodeエンコード・デコード', category: 'Encode' },

  // Crypto
  'hash-md5': { title: 'MD5 Hash', descJa: 'MD5ハッシュ値を生成', category: 'Crypto' },
  'hash-sha1': { title: 'SHA-1 Hash', descJa: 'SHA-1ハッシュ値を生成', category: 'Crypto' },
  'hash-sha256': { title: 'SHA Hash', descJa: 'SHA-256/384/512ハッシュ値を生成', category: 'Crypto' },
  'hash-crc32': { title: 'CRC32', descJa: 'CRC32チェックサムを計算', category: 'Crypto' },
  'hash-hmac': { title: 'HMAC Generator', descJa: 'HMAC認証コードを生成', category: 'Crypto' },
  'aes-encrypt': { title: 'AES Encrypt', descJa: 'AES-256-GCM暗号化・復号化', category: 'Crypto' },
  'des-encrypt': { title: 'DES Encrypt', descJa: 'Triple DES(3DES)暗号化・復号化', category: 'Crypto' },
  'bcrypt-hash': { title: 'Bcrypt Hash', descJa: 'Bcryptハッシュの生成・検証', category: 'Crypto' },
  'rsa-keygen': { title: 'RSA Key Generator', descJa: 'RSA公開鍵/秘密鍵ペアを生成', category: 'Crypto' },
  'crypto-caesar': { title: 'Caesar Cipher', descJa: 'シーザー暗号の暗号化・復号化', category: 'Crypto' },
  'crypto-rot13': { title: 'ROT13', descJa: 'ROT13変換', category: 'Crypto' },
  'crypto-vigenere': { title: 'Vigenere Cipher', descJa: 'ヴィジュネル暗号の暗号化・復号化', category: 'Crypto' },
  'crypto-atbash': { title: 'Atbash Cipher', descJa: 'アトバシュ暗号の暗号化・復号化', category: 'Crypto' },
  'crypto-affine': { title: 'Affine Cipher', descJa: 'アフィン暗号の暗号化・復号化', category: 'Crypto' },
  'crypto-rail-fence': { title: 'Rail Fence Cipher', descJa: 'レールフェンス暗号の暗号化・復号化', category: 'Crypto' },
  'enigma-cipher': { title: 'Enigma Cipher', descJa: 'Enigma暗号マシンシミュレーター', category: 'Crypto' },

  // Number
  'number-base-converter': { title: 'Base Converter', descJa: '2進/8進/10進/16進数を相互変換', category: 'Number' },
  'number-fraction': { title: 'Fraction', descJa: '小数を分数に変換', category: 'Number' },
  'number-kanji': { title: 'Kanji Number', descJa: '数字と漢数字を相互変換', category: 'Number' },
  'math-calculator': { title: 'Calculator', descJa: '電卓', category: 'Number' },
  'math-percentage': { title: 'Percentage Calculator', descJa: '割合・パーセント計算', category: 'Number' },
  'math-statistics': { title: 'Statistics Calculator', descJa: '平均・中央値・標準偏差等の統計計算', category: 'Number' },
  'math-area': { title: 'Area Calculator', descJa: '各種図形の面積計算', category: 'Number' },
  'unit-converter': { title: 'Unit Converter', descJa: '長さ・重さ・温度等の単位変換', category: 'Number' },
  'random-number': { title: 'Random Number', descJa: '指定範囲の乱数生成', category: 'Number' },
  'random-dice': { title: 'Dice Roller', descJa: 'サイコロシミュレーター', category: 'Number' },
  'random-coin': { title: 'Coin Flip', descJa: 'コイン投げシミュレーター', category: 'Number' },

  // DateTime
  'datetime-unix': { title: 'Unix Timestamp', descJa: 'UNIXタイムスタンプと日時の相互変換', category: 'DateTime' },
  'datetime-iso8601': { title: 'ISO 8601', descJa: 'ISO 8601形式の日時変換', category: 'DateTime' },
  'datetime-rfc2822': { title: 'RFC 2822', descJa: 'RFC 2822形式の日時変換', category: 'DateTime' },
  'datetime-diff': { title: 'Date Diff', descJa: '2つの日付間の差分を計算', category: 'DateTime' },
  'datetime-wareki': { title: 'Wareki Converter', descJa: '西暦と和暦の相互変換', category: 'DateTime' },
  'datetime-world-clock': { title: 'World Clock', descJa: '世界各地のタイムゾーン時刻表示', category: 'DateTime' },
  'datetime-countdown': { title: 'Countdown', descJa: '指定日時までのカウントダウン', category: 'DateTime' },
  'datetime-timer': { title: 'Timer', descJa: 'カウントダウンタイマー', category: 'DateTime' },
  'datetime-stopwatch': { title: 'Stopwatch', descJa: 'ストップウォッチ', category: 'DateTime' },
  'datetime-crontab': { title: 'Crontab', descJa: 'Cron式の生成・パース・次回実行時刻計算', category: 'DateTime' },
  'datetime-eta': { title: 'ETA Calculator', descJa: '到着予想時刻(ETA)を計算', category: 'DateTime' },

  // JSON
  'json-formatter': { title: 'JSON Formatter', descJa: 'JSONの整形(フォーマット)', category: 'JSON' },
  'json-minify': { title: 'JSON Minify', descJa: 'JSONの圧縮(ミニファイ)', category: 'JSON' },
  'json-validator': { title: 'JSON Validator', descJa: 'JSON構文の検証', category: 'JSON' },
  'json-viewer': { title: 'JSON Viewer', descJa: 'JSONのツリービュー表示', category: 'JSON' },
  'json-editor': { title: 'JSON Editor', descJa: 'JSONの編集・整形・検証', category: 'JSON' },
  'json-diff': { title: 'JSON Diff', descJa: '2つのJSONの差分比較', category: 'JSON' },
  'json-to-csv': { title: 'JSON to CSV', descJa: 'JSONをCSVに変換', category: 'JSON' },
  'json-to-yaml': { title: 'JSON to YAML', descJa: 'JSONをYAMLに変換', category: 'JSON' },
  'json-to-xml': { title: 'JSON to XML', descJa: 'JSONをXMLに変換', category: 'JSON' },
  'json-to-toml': { title: 'JSON to TOML', descJa: 'JSONをTOMLに変換', category: 'JSON' },
  'json-to-table': { title: 'JSON to Table', descJa: 'JSONをテーブル表示に変換', category: 'JSON' },
  'jsonpath-tester': { title: 'JSONPath Tester', descJa: 'JSONPath式のテスト・検証', category: 'JSON' },

  // Code
  'html-formatter': { title: 'HTML Formatter', descJa: 'HTMLコードの整形', category: 'Code' },
  'html-minifier': { title: 'HTML Minifier', descJa: 'HTMLコードの圧縮', category: 'Code' },
  'css-formatter': { title: 'CSS Formatter', descJa: 'CSSコードの整形', category: 'Code' },
  'css-minifier': { title: 'CSS Minifier', descJa: 'CSSコードの圧縮', category: 'Code' },
  'scss-formatter': { title: 'SCSS Formatter', descJa: 'SCSSコードの整形', category: 'Code' },
  'js-formatter': { title: 'JS Formatter', descJa: 'JavaScript/TypeScriptコードの整形', category: 'Code' },
  'js-minifier': { title: 'JS Minifier', descJa: 'JavaScriptコードの圧縮', category: 'Code' },
  'ts-formatter': { title: 'TypeScript Formatter', descJa: 'TypeScriptコードの整形', category: 'Code' },
  'sql-formatter': { title: 'SQL Formatter', descJa: 'SQLクエリの整形・圧縮', category: 'Code' },
  'xml-formatter': { title: 'XML Formatter', descJa: 'XMLの整形・圧縮', category: 'Code' },
  'yaml-formatter': { title: 'YAML Formatter', descJa: 'YAMLの整形・JSON変換', category: 'Code' },
  'graphql-formatter': { title: 'GraphQL Formatter', descJa: 'GraphQLクエリの整形・圧縮', category: 'Code' },
  'syntax-highlight': { title: 'Syntax Highlighter', descJa: 'コードのシンタックスハイライト表示', category: 'Code' },
  'code-diff-viewer': { title: 'Diff Viewer', descJa: 'テキスト/コードの差分ビューアー', category: 'Code' },
  'code-http-status': { title: 'HTTP Status', descJa: 'HTTPステータスコード一覧・検索', category: 'Code' },
  'code-jwt-decoder': { title: 'JWT Decoder', descJa: 'JWTトークンのデコード・検証', category: 'Code' },
  'code-regex-tester': { title: 'Regex Tester', descJa: '正規表現のテスト・検証', category: 'Code' },
  'code-chmod': { title: 'Chmod Calculator', descJa: 'ファイルパーミッション(chmod)計算', category: 'Code' },
  'code-to-image': { title: 'Code to Image', descJa: 'コードを美しい画像に変換', category: 'Code' },
  'docker-compose-converter': { title: 'Docker Run to Compose', descJa: 'docker runコマンドをdocker-compose.ymlに変換', category: 'Code' },
  'git-cheatsheet': { title: 'Git Cheatsheet', descJa: 'Gitコマンドのチートシート', category: 'Code' },

  // Color
  'color-converter': { title: 'Color Converter', descJa: 'HEX/RGB/HSL等のカラーコード変換', category: 'Color' },
  'color-picker': { title: 'Color Picker', descJa: 'カラーピッカー', category: 'Color' },
  'color-mixer': { title: 'Color Mixer', descJa: '色の混合シミュレーション', category: 'Color' },
  'color-shade': { title: 'Color Shade', descJa: 'カラーシェード・ティント生成', category: 'Color' },
  'color-brightness': { title: 'Color Brightness', descJa: '色の明度・彩度調整', category: 'Color' },
  'color-invert': { title: 'Color Invert', descJa: '色の反転', category: 'Color' },
  'color-blind-simulator': { title: 'Color Blind Simulator', descJa: '色覚シミュレーション', category: 'Color' },
  'css-gradient': { title: 'CSS Gradient', descJa: 'CSSグラデーション生成', category: 'Color' },
  'css-box-shadow': { title: 'CSS Box Shadow', descJa: 'CSS Box Shadow生成', category: 'Color' },
  'css-border-radius': { title: 'CSS Border Radius', descJa: 'CSS Border Radius生成', category: 'Color' },
  'css-glassmorphism': { title: 'Glassmorphism', descJa: 'Glassmorphism効果生成', category: 'Color' },
  'css-clip-path': { title: 'CSS Clip Path', descJa: 'CSS Clip Path生成', category: 'Color' },
  'css-flexbox': { title: 'Flexbox Playground', descJa: 'CSS Flexboxの視覚的プレイグラウンド', category: 'Color' },
  'css-grid': { title: 'CSS Grid', descJa: 'CSS Gridの視覚的プレイグラウンド', category: 'Color' },
  'css-checkbox': { title: 'CSS Checkbox', descJa: 'CSSのみのCheckbox/Switch生成', category: 'Color' },
  'css-loader': { title: 'CSS Loader', descJa: 'CSSローディングアニメーション生成', category: 'Color' },

  // Image
  'image-crop': { title: 'Image Crop', descJa: '画像のトリミング', category: 'Image' },
  'image-resize': { title: 'Image Resize', descJa: '画像のリサイズ', category: 'Image' },
  'image-generate': { title: 'Image Generator', descJa: 'ダミー画像・カスタム画像の生成', category: 'Image' },
  'image-grayscale': { title: 'Image Grayscale', descJa: '画像のグレースケール変換', category: 'Image' },
  'image-transparent': { title: 'Image Transparent', descJa: '画像の透過処理', category: 'Image' },
  'image-trim': { title: 'Image Trim', descJa: '透過PNG画像の余白トリミング', category: 'Image' },
  'image-assets': { title: 'Image Assets', descJa: 'SNS/デバイス向け画像一括リサイズ', category: 'Image' },
  'image-compress': { title: 'Image Compress', descJa: '画像の圧縮', category: 'Image' },
  'image-convert': { title: 'Image Convert', descJa: '画像フォーマット変換(JPEG/PNG/WebP)', category: 'Image' },
  'image-flip': { title: 'Image Flip', descJa: '画像の反転(水平/垂直)', category: 'Image' },
  'image-brightness': { title: 'Image Brightness', descJa: '画像の明度調整', category: 'Image' },
  'image-filter': { title: 'Image Filter', descJa: '画像にフィルター効果を適用', category: 'Image' },
  'image-color-extract': { title: 'Color Extract', descJa: '画像から色を抽出', category: 'Image' },
  'image-ascii-art': { title: 'ASCII Art', descJa: '画像をアスキーアートに変換', category: 'Image' },
  'image-favicon': { title: 'Favicon Generator', descJa: 'ファビコン(favicon.ico)の生成', category: 'Image' },
  'image-app-icon': { title: 'App Icon Generator', descJa: 'iOS/Android向けアプリアイコン生成', category: 'Image' },
  'image-svg-blob': { title: 'SVG Blob', descJa: 'SVG Blobシェイプの生成', category: 'Image' },
  'image-svg-pattern': { title: 'SVG Pattern', descJa: 'SVGパターン背景の生成', category: 'Image' },
  'image-svg-placeholder': { title: 'SVG Placeholder', descJa: 'SVGプレースホルダー画像の生成', category: 'Image' },
  'image-to-base64': { title: 'Image to Base64', descJa: '画像のBase64エンコード', category: 'Image' },
  'image-ocr': { title: 'OCR', descJa: '画像からテキストを抽出(OCR)', category: 'Image' },
  'handwriting-converter': { title: 'Handwriting Converter', descJa: 'テキストを手書き風画像に変換', category: 'Image' },

  // PDF
  'pdf-merge': { title: 'PDF Merge', descJa: '複数PDFファイルの結合', category: 'PDF' },
  'pdf-split': { title: 'PDF Split', descJa: 'PDFのページ分割', category: 'PDF' },
  'pdf-compress': { title: 'PDF Compress', descJa: 'PDFの圧縮', category: 'PDF' },
  'pdf-rotate': { title: 'PDF Rotate', descJa: 'PDFページの回転', category: 'PDF' },
  'pdf-metadata': { title: 'PDF Metadata', descJa: 'PDFメタデータの表示・編集', category: 'PDF' },
  'pdf-watermark': { title: 'PDF Watermark', descJa: 'PDFにウォーターマーク追加', category: 'PDF' },
  'pdf-password': { title: 'PDF Password', descJa: 'PDFのパスワード保護', category: 'PDF' },
  'pdf-to-image': { title: 'PDF to Image', descJa: 'PDFを画像に変換', category: 'PDF' },
  'image-to-pdf': { title: 'Image to PDF', descJa: '画像をPDFに変換', category: 'PDF' },

  // Video
  'video-to-gif': { title: 'Video to GIF', descJa: '動画からGIFアニメーションを作成', category: 'Video' },
  'gif-frame-extractor': { title: 'GIF Frame Extractor', descJa: 'GIFからフレームを抽出', category: 'Video' },
  'screen-recorder': { title: 'Screen Recorder', descJa: 'ブラウザ上で画面録画', category: 'Video' },
  'webcam-test': { title: 'Webcam Test', descJa: 'Webカメラの動作テスト', category: 'Video' },

  // Generator
  'gen-password': { title: 'Password Generator', descJa: 'セキュアなパスワード生成', category: 'Generator' },
  'password-generator': { title: 'Password Generator', descJa: 'パスワード生成ツール', category: 'Generator' },
  'gen-uuid': { title: 'UUID Generator', descJa: 'UUID v4 / ULIDの生成', category: 'Generator' },
  'uuid-generator': { title: 'UUID/ULID Generator', descJa: 'UUID/ULIDの生成', category: 'Generator' },
  'gen-dummy-data': { title: 'Dummy Data', descJa: 'ダミーデータ(JSON/CSV)の生成', category: 'Generator' },
  'dummy-data-generator': { title: 'Dummy Data Generator', descJa: 'ダミーデータ生成', category: 'Generator' },
  'gen-htpasswd': { title: 'htpasswd Generator', descJa: '.htpasswdエントリの生成', category: 'Generator' },
  'htpasswd-generator': { title: '.htpasswd Generator', descJa: '.htpasswdファイルのエントリ生成', category: 'Generator' },
  'bip39-generator': { title: 'BIP39 Generator', descJa: 'BIP39ニーモニックフレーズ生成', category: 'Generator' },
  'qr-code-generator': { title: 'QR Code Generator', descJa: 'QRコードの生成', category: 'Generator' },
  'qr-code-reader': { title: 'QR Code Reader', descJa: 'QRコードの読み取り', category: 'Generator' },
  'barcode-generator': { title: 'Barcode Generator', descJa: '各種バーコードの生成', category: 'Generator' },
  'seo-ogp-generator': { title: 'OGP Generator', descJa: 'OGPメタタグの生成', category: 'Generator' },
  'morpheme-analyzer': { title: 'Morpheme Analyzer', descJa: '日本語テキストの文字種別分割', category: 'Generator' },
  'braille-converter': { title: 'Braille Converter', descJa: 'テキストを点字に変換', category: 'Generator' },

  // Network / Misc
  'cidr-calculator': { title: 'CIDR Calculator', descJa: 'CIDR表記のIPアドレス範囲計算', category: 'Network' },
  'subnet-calculator': { title: 'Subnet Calculator', descJa: 'IPv4サブネット計算', category: 'Network' },
  'network-subnet': { title: 'Network Subnet', descJa: 'IPv4サブネット計算', category: 'Network' },
  'network-user-agent': { title: 'User Agent Parser', descJa: 'User Agent文字列の解析', category: 'Network' },
  'user-agent-parser': { title: 'User Agent Parser', descJa: 'User Agent文字列の解析', category: 'Network' },
  'display-checker': { title: 'Display Checker', descJa: '画面解像度・DPI等の情報チェック', category: 'Network' },
  'validator-html': { title: 'HTML Validator', descJa: 'HTMLの構文検証', category: 'Network' },
  'validator-xml': { title: 'XML Validator', descJa: 'XMLの構文検証', category: 'Network' },
  'validator-password': { title: 'Password Checker', descJa: 'パスワード強度チェック', category: 'Network' },
  'csv-to-chart': { title: 'CSV to Chart', descJa: 'CSVデータからグラフを生成', category: 'Network' },
  'csv-to-sql': { title: 'CSV to SQL', descJa: 'CSVをSQL INSERT文に変換', category: 'Network' },
  'list-compare': { title: 'List Compare', descJa: '2つのリストの差分・共通項を比較', category: 'Network' },
  'list-randomize': { title: 'List Randomizer', descJa: 'リストの並び替え・ランダム化', category: 'Network' },
};

interface AppInfo {
  name: string;
  title: string;
  descJa: string;
  category: string;
  port: number | null;
  wranglerName: string | null;
  keyDeps: string[];
  utilFiles: string[];
  hasTests: boolean;
}

function getAppInfo(appName: string): AppInfo {
  const appDir = join(APPS_DIR, appName);
  const meta = APP_META[appName];

  // Fallback title from app name
  const title = meta?.title ?? appName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const descJa = meta?.descJa ?? title;
  const category = meta?.category ?? 'Other';

  // Port from vite.config.ts
  let port: number | null = null;
  try {
    const viteConfig = readFileSync(join(appDir, 'vite.config.ts'), 'utf-8');
    const portMatch = viteConfig.match(/port:\s*(\d+)/);
    if (portMatch) port = parseInt(portMatch[1]);
  } catch {}

  // Wrangler name
  let wranglerName: string | null = null;
  try {
    const wrangler = readFileSync(join(appDir, 'wrangler.toml'), 'utf-8');
    const nameMatch = wrangler.match(/name\s*=\s*"([^"]+)"/);
    if (nameMatch) wranglerName = nameMatch[1];
  } catch {}

  // Key dependencies (non-standard)
  let keyDeps: string[] = [];
  try {
    const pkg = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf-8'));
    const deps = Object.keys(pkg.dependencies || {});
    keyDeps = deps.filter(d => !d.match(/^(@radix|class-variance|clsx|lucide|react|tailwind-merge)/));
  } catch {}

  // Utils files
  let utilFiles: string[] = [];
  try {
    const utilsDir = join(appDir, 'src', 'utils');
    if (existsSync(utilsDir)) {
      utilFiles = readdirSync(utilsDir).filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts') && f !== '__tests__');
    }
  } catch {}

  // Has tests
  let hasTests = false;
  try {
    const testsDir = join(appDir, 'src', 'utils', '__tests__');
    hasTests = existsSync(testsDir) && readdirSync(testsDir).some(f => f.endsWith('.test.ts'));
  } catch {}

  return { name: appName, title, descJa, category, port, wranglerName, keyDeps, utilFiles, hasTests };
}

function generateReadme(info: AppInfo): string {
  const lines: string[] = [];

  lines.push(`# ${info.title}`);
  lines.push('');
  lines.push(`${info.descJa}。ブラウザ上で完結するクライアントサイドツール。`);
  lines.push('');
  lines.push(`**URL**: ${BASE_URL}/${info.name}`);
  lines.push('');

  lines.push('## 技術スタック');
  lines.push('');
  lines.push('- React 18 + TypeScript');
  lines.push('- Vite 6');
  lines.push('- Tailwind CSS 3.4 + shadcn/ui');
  lines.push('- Cloudflare Pages');
  if (info.keyDeps.length > 0) {
    lines.push('');
    lines.push('### 主要ライブラリ');
    lines.push('');
    for (const dep of info.keyDeps) {
      lines.push(`- \`${dep}\``);
    }
  }
  lines.push('');

  lines.push('## 開発');
  lines.push('');
  lines.push('```bash');
  lines.push('# 依存関係のインストール (ルートから)');
  lines.push('bun install');
  lines.push('');
  lines.push('# 開発サーバー起動');
  lines.push(`cd apps/${info.name}`);
  lines.push('bun run dev');
  lines.push('');
  lines.push('# ビルド');
  lines.push('bun run build');
  lines.push('');
  lines.push('# デプロイ');
  lines.push('bun run deploy');
  lines.push('```');
  lines.push('');

  if (info.hasTests) {
    lines.push('## テスト');
    lines.push('');
    lines.push('```bash');
    lines.push('bun test');
    lines.push('```');
    lines.push('');
  }

  lines.push('## ディレクトリ構成');
  lines.push('');
  lines.push('```');
  lines.push(`apps/${info.name}/`);
  lines.push('  src/');
  lines.push('    App.tsx          # メインコンポーネント');
  lines.push('    main.tsx         # エントリポイント');
  lines.push('    components/ui/   # shadcn/ui コンポーネント');
  if (info.utilFiles.length > 0) {
    lines.push('    utils/           # ユーティリティ関数');
    for (const f of info.utilFiles) {
      lines.push(`      ${f}`);
    }
  }
  lines.push('  index.html');
  lines.push('  package.json');
  lines.push('  vite.config.ts');
  lines.push('  wrangler.toml');
  lines.push('```');
  lines.push('');

  lines.push('## ライセンス');
  lines.push('');
  lines.push('MIT');
  lines.push('');

  return lines.join('\n');
}

function generateClaudeMd(info: AppInfo): string {
  const lines: string[] = [];

  lines.push(`# ${info.title}`);
  lines.push('');
  lines.push(`${info.descJa}。`);
  lines.push('');

  lines.push('## アーキテクチャ');
  lines.push('');
  lines.push('- SPA: React 18 + TypeScript + Vite 6');
  lines.push('- UI: Tailwind CSS 3.4 + shadcn/ui (Radix UI)');
  lines.push('- デプロイ: Cloudflare Pages');
  lines.push('- 完全クライアントサイド処理(サーバー通信なし)');
  lines.push('');

  if (info.utilFiles.length > 0) {
    lines.push('## 主要ファイル');
    lines.push('');
    lines.push('- `src/App.tsx` - メインUI');
    for (const f of info.utilFiles) {
      lines.push(`- \`src/utils/${f}\` - コアロジック`);
    }
    lines.push('');
  }

  if (info.keyDeps.length > 0) {
    lines.push('## 外部依存');
    lines.push('');
    for (const dep of info.keyDeps) {
      lines.push(`- \`${dep}\``);
    }
    lines.push('');
  }

  lines.push('## コマンド');
  lines.push('');
  lines.push('```bash');
  lines.push('bun run dev      # 開発サーバー');
  lines.push('bun run build    # ビルド');
  lines.push('bun test         # テスト');
  lines.push('bun run deploy   # デプロイ');
  lines.push('```');
  lines.push('');

  lines.push('## 規約');
  lines.push('');
  lines.push('- パスエイリアス: `@/` = `src/`, `@components/` = `src/components/`');
  lines.push('- ボタンには必ず `type="button"` を付与');
  lines.push('- 非同期クリップボード操作は try/catch で囲む');
  lines.push('- linter: Biome (`bun run lint`)');
  lines.push('- テスト: bun test (`src/utils/__tests__/`)');
  lines.push('');

  return lines.join('\n');
}

// ── メイン処理 ──
const appDirs = readdirSync(APPS_DIR)
  .filter(d => statSync(join(APPS_DIR, d)).isDirectory())
  .sort();

let created = 0;
let skippedReadme = 0;

for (const appName of appDirs) {
  const info = getAppInfo(appName);
  const appDir = join(APPS_DIR, appName);

  // README.md
  const readmePath = join(appDir, 'README.md');
  const readme = generateReadme(info);
  writeFileSync(readmePath, readme);

  // CLAUDE.md
  const claudePath = join(appDir, 'CLAUDE.md');
  const claudeMd = generateClaudeMd(info);
  writeFileSync(claudePath, claudeMd);

  created++;
}

console.log(`Done! Generated README.md + CLAUDE.md for ${created} apps.`);
