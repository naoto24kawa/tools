import React, { useCallback } from 'react';

interface ImageUploadProps {
  onImageLoad: (file: File, src: string, width: number, height: number) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 8000;

export function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'サポートされていないファイル形式です。JPEG、PNG、WebP、GIFのみ対応しています。';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'ファイルサイズは10MB以下にしてください。';
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        alert(error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
            alert(`画像サイズは${MAX_DIMENSION}x${MAX_DIMENSION}px以下にしてください。`);
            return;
          }
          onImageLoad(file, e.target?.result as string, img.naturalWidth, img.naturalHeight);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
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
      className={`upload-area ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="upload-input"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleChange}
        aria-label="画像を選択"
      />
      <div className="upload-icon">📁</div>
      <p className="upload-text">画像をドラッグ＆ドロップ、またはクリックして選択</p>
      <p className="upload-hint">JPEG、PNG、WebP、GIF（最大10MB、8000x8000px）</p>
    </div>
  );
}
