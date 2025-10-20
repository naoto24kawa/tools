import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { IMAGE_UPLOAD_CONFIG } from '@config/constants';
import { validateFile } from '@utils/imageValidator';
import { loadImage } from '@utils/imageLoader';
import { cn } from '../lib/utils';

interface ImageUploadProps {
  onImageLoad: (file: File, src: string, width: number, height: number) => void;
}

const { allowedTypes } = IMAGE_UPLOAD_CONFIG;

export function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      // ファイルの基本的なバリデーション
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError.message);
        return;
      }

      try {
        // 画像の読み込みとサイズバリデーション
        const { src, width, height } = await loadImage(file);
        onImageLoad(file, src, width, height);
      } catch (error) {
        // エラーメッセージの表示
        if (error && typeof error === 'object' && 'message' in error) {
          alert(error.message as string);
        } else {
          alert('画像の読み込みに失敗しました。別のファイルを選択してください。');
        }
        console.error('画像読み込みエラー:', error);
      }
    },
    [onImageLoad]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={cn(
        'relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 bg-background p-12 text-center transition-colors hover:border-primary hover:bg-muted/50',
        dragActive && 'border-primary border-solid bg-muted/50'
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={handleChange}
        aria-label="画像を選択"
      />
      <Upload className="mx-auto mb-4 h-12 w-12 text-primary" />
      <p className="mb-2 text-base font-medium text-foreground">
        画像をドラッグ＆ドロップ、またはクリックして選択
      </p>
      <p className="text-sm text-muted-foreground">JPEG、PNG、WebP、GIF（最大10MB、8000x8000px）</p>
    </div>
  );
}
