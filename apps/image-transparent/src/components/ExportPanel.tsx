import { Button } from '@components/ui/button';
import { downloadDataUrl } from '@utils/transparentImage';
import { Download, RotateCcw } from 'lucide-react';

interface ExportPanelProps {
  processedImageUrl: string | null;
  onReset: () => void;
}

export function ExportPanel({ processedImageUrl, onReset }: ExportPanelProps) {
  const handleDownload = () => {
    if (!processedImageUrl) return;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    downloadDataUrl(processedImageUrl, `transparent_${timestamp}.png`);
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownload} disabled={!processedImageUrl} className="flex-1">
        <Download className="mr-2 h-4 w-4" />
        PNG をダウンロード
      </Button>
      <Button variant="outline" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        リセット
      </Button>
    </div>
  );
}
