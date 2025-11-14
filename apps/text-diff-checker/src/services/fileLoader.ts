import { MAX_FILE_SIZE } from '@config/constants';

/**
 * テキストファイルを読み込む
 */
export async function loadTextFile(file: File): Promise<string> {
  // ファイルサイズチェック
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `ファイルサイズが大きすぎます（最大: ${MAX_FILE_SIZE / 1024 / 1024}MB）`
    );
  }

  // テキストファイルチェック
  const isTextFile =
    file.type.startsWith('text/') ||
    file.name.match(/\.(txt|md|json|js|ts|tsx|jsx|py|html|css|scss|sass|less|xml|yaml|yml)$/i);

  if (!isTextFile) {
    throw new Error('テキストファイルのみサポートしています');
  }

  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('File loading error:', error);
    throw new Error('ファイルの読み込みに失敗しました');
  }
}
