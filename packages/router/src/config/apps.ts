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
    path: '/image-resize',
    url: 'https://tools-image-resize.elchika.app',
    name: '画像のリサイズ',
    icon: '📐',
    displayName: 'Image Resize',
    description: '画像を拡大・縮小 - パーセント、ピクセル、ファイルサイズで指定可能',
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
