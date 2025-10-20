import type { PreviewInfo as PreviewInfoType } from '@types';
import { Image, Scissors, Ratio } from 'lucide-react';

interface PreviewInfoProps {
  previewInfo: PreviewInfoType;
}

export function PreviewInfo({ previewInfo }: PreviewInfoProps) {
  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center justify-between border-b py-2.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Image className="h-3.5 w-3.5" />
          元画像
        </span>
        <span className="text-sm font-semibold">
          {previewInfo.originalSize.width} x {previewInfo.originalSize.height}px
        </span>
      </div>
      <div className="flex items-center justify-between border-b py-2.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Scissors className="h-3.5 w-3.5" />
          トリミング後
        </span>
        <span className="text-sm font-semibold">
          {previewInfo.croppedSize.width} x {previewInfo.croppedSize.height}px
        </span>
      </div>
      <div className="flex items-center justify-between py-2.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Ratio className="h-3.5 w-3.5" />
          アスペクト比
        </span>
        <span className="text-sm font-semibold">{previewInfo.aspectRatio}</span>
      </div>
    </div>
  );
}
