/**
 * エラーハンドリングユーティリティ
 * アプリケーション全体で統一的なエラー処理を提供
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * ユーザーにエラーメッセージを表示
 */
export function showError(message: string, error?: Error): void {
  if (error) {
    console.error('[Error]', message, error);
  } else {
    console.error('[Error]', message);
  }
  alert(message);
}

/**
 * エラーをログに記録してユーザーに通知
 */
export function handleError(error: unknown, userMessage: string): void {
  if (error instanceof Error) {
    console.error('[Error]', userMessage, error);
  } else {
    console.error('[Error]', userMessage, error);
  }
  alert(userMessage);
}

/**
 * 画像関連のエラーメッセージ定数
 */
export const ERROR_MESSAGES = {
  IMAGE_LOAD_FAILED: '画像の読み込みに失敗しました',
  IMAGE_TOO_LARGE: '画像サイズが大きすぎます（最大: 10MB）',
  INVALID_IMAGE_FORMAT: '対応していない画像形式です',
  EXPORT_FAILED: 'エクスポートに失敗しました',
  CROP_PROCESSING_FAILED: '画像の処理に失敗しました',
} as const;
