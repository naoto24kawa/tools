/**
 * テスト用の画像を生成するスクリプト
 * Canvas APIを使用してシンプルなテスト画像を作成します
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// テスト画像を生成する関数
function generateTestImage(width: number, height: number, filename: string) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // グラデーション背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#4A90E2');
  gradient.addColorStop(1, '#7B68EE');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // テキストを追加
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Test Image', width / 2, height / 2);
  ctx.font = '24px Arial';
  ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 50);

  // 画像を保存
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, filename);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// 複数のテスト画像を生成
generateTestImage(1920, 1080, 'test-image.png');
generateTestImage(800, 600, 'test-image-small.png');
generateTestImage(3840, 2160, 'test-image-large.png');

console.log('All test images generated successfully!');
