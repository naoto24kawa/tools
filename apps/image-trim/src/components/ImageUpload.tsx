import { Button } from '@components/ui/button';
import { formatFileSize, IMAGE_UPLOAD_CONFIG } from '@config/constants';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageLoad: (file: File, src: string, width: number, height: number) => void;
}

export function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndLoadFile = (file: File) => {
    setError(null);

    // ファイルタイプチェック
    if (!IMAGE_UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
      setError('PNG または WebP 形式の画像を選択してください');
      return;
    }

    // ファイルサイズチェック
    if (file.size > IMAGE_UPLOAD_CONFIG.maxFileSize) {
      setError(
        `ファイルサイズが大きすぎます (最大: ${formatFileSize(IMAGE_UPLOAD_CONFIG.maxFileSize)})`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // 画像サイズチェック
        if (
          img.naturalWidth > IMAGE_UPLOAD_CONFIG.maxDimension ||
          img.naturalHeight > IMAGE_UPLOAD_CONFIG.maxDimension
        ) {
          setError(`画像サイズが大きすぎます (最大: ${IMAGE_UPLOAD_CONFIG.maxDimension}px)`);
          return;
        }
        onImageLoad(file, src, img.naturalWidth, img.naturalHeight);
      };
      img.onerror = () => {
        setError('画像の読み込みに失敗しました');
      };
      img.src = src;
    };
    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_UPLOAD_CONFIG.allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* biome-ignore lint/a11y/useSemanticElements: Drag-drop zone requires div for proper drag events */}
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary'
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="space-y-3">
          <div className="text-4xl">📁</div>
          <div>
            <p className="font-semibold">クリックまたはドラッグ&ドロップ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PNG, WebP / 最大 {formatFileSize(IMAGE_UPLOAD_CONFIG.maxFileSize)}
            </p>
          </div>
          <Button variant="outline" type="button">
            ファイルを選択
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
    </div>
  );
}
