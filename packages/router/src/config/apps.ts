/**
 * アプリケーション設定
 *
 * 新規ツールを追加する場合は、この配列に追加するだけでOK
 */
export const APPS_CONFIG = [
  {
    path: '/image-crop',
    url: 'https://tools-image-crop.elchika.app',
    name: '画像のトリミング',
    icon: '📸',
    displayName: 'Image Crop',
    description: '画像のトリミングとリサイズ - OGP画像やREADME用スクリーンショットに',
  },
  {
    path: '/image-generate',
    url: 'https://tools-image-generate.elchika.app',
    name: '画像ファイルを生成します',
    icon: '🎨',
    displayName: 'Image Generate',
    description: 'プレースホルダー画像を生成 - モックアップやテストデータ作成に',
  },
  {
    path: '/image-grayscale',
    url: 'https://tools-image-grayscale.elchika.app',
    name: 'グレースケール変換',
    icon: '⚫',
    displayName: 'Image Grayscale',
    description: '画像をグレースケールに変換 - モノクロ画像の作成に',
  },
  {
    path: '/image-resize',
    url: 'https://tools-image-resize.elchika.app',
    name: '画像のリサイズ',
    icon: '📐',
    displayName: 'Image Resize',
    description: '画像を拡大・縮小 - パーセント、ピクセル、ファイルサイズで指定可能',
  },
  {
    path: '/text-counter',
    url: 'https://tools-text-counter.elchika.app',
    name: 'テキストカウンター',
    icon: '📝',
    displayName: 'Text Counter',
    description: 'テキストの文字数、単語数、行数などをリアルタイムで解析 - 文書作成や翻訳作業に',
  },
  {
    path: '/text-diff-checker',
    url: 'https://tools-text-diff-checker.elchika.app',
    name: 'テキスト差分チェッカー',
    icon: '🔍',
    displayName: 'Text Diff Checker',
    description: '2つのテキストを比較して差分を視覚的に表示 - コードレビューや文書比較に',
  },
  {
    path: '/text-deduplicate',
    url: 'https://tools-text-deduplicate.elchika.app',
    name: '重複行削除',
    icon: '🔀',
    displayName: 'Text Deduplicate',
    description: 'テキストの重複行を削除して整理 - ログファイルやデータの整理に最適',
  },
  {
    path: '/image-assets',
    url: 'https://tools-image-assets.elchika.app',
    name: 'アセット画像生成',
    icon: '🖼️',
    displayName: 'Image Assets',
    description: 'OGP、Favicon、Twitter Card、PWAアイコンを一括生成 - Web開発に必要な画像を一度に作成',
  },
  {
    path: '/url-encoder',
    url: 'https://tools-url-encoder.elchika.app',
    name: 'URL encode and decode tool',
    icon: '✨',
    displayName: 'UrlEncoder',
    description: 'URL encode and decode tool',
  },
  {
    path: '/image-transparent',
    url: 'https://tools-image-transparent.elchika.app',
    name: '画像透過ツール',
    icon: '🔍',
    displayName: 'Image Transparent',
    description: '画像の特定の色を透過に変換 - 背景除去やロゴ作成に',
  },
  {
    path: '/image-trim',
    url: 'https://tools-image-trim.elchika.app',
    name: '透過余白トリミング',
    icon: '✂️',
    displayName: 'Image Trim',
    description: '透過PNGの余白を自動トリミング - アイコンやロゴの余白除去に最適',
  },
  {
    path: '/video-to-gif',
    url: 'https://tools-video-to-gif.elchika.app',
    name: 'Video to GIF',
    icon: '🎬',
    displayName: 'Video to GIF',
    description: '動画からフレームを抽出してダウンロード - GIF作成やサムネイル抽出に',
  },
] as const;

/**
 * システムパス（ヘルスチェックなど）
 */
export const SYSTEM_PATHS = ['/', '/health'] as const;

/**
 * 利用可能な全パス
 */
export const AVAILABLE_PATHS = [...SYSTEM_PATHS, ...APPS_CONFIG.map((app) => app.path)] as const;
