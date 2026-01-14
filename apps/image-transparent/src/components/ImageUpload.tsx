import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '@config/constants';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploadProps {
  onFileLoad: (file: File) => void;
  onError?: (error: string) => void;
}

export function ImageUpload({ onFileLoad, onError }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndLoadFile = (file: File) => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      onError?.('対応していないファイル形式です');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError?.(
        `ファイルサイズが大きすぎます（最大: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB）`
      );
      return;
    }

    onFileLoad(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    validateAndLoadFile(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    validateAndLoadFile(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_FORMATS.join(',')}
        onChange={handleFileChange}
        className="hidden"
        aria-label="画像ファイルを選択"
      />

      <Card
        className="cursor-pointer border-2 border-dashed p-12 text-center transition-colors hover:border-primary"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-semibold">クリックまたはドラッグ＆ドロップ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PNG, JPEG, WebP, GIF / 最大 {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
          <Button variant="outline" type="button">
            ファイルを選択
          </Button>
        </div>
      </Card>
    </>
  );
}
