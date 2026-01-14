import type { GeneratedAsset } from '../utils/assetGenerator';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface AssetPreviewProps {
  assets: GeneratedAsset[];
  onDownloadAll: () => void;
  isGenerating: boolean;
}

export function AssetPreview({ assets, onDownloadAll, isGenerating }: AssetPreviewProps) {
  if (assets.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Generated Assets</h2>
        <Button onClick={onDownloadAll} disabled={isGenerating}>
          <Download className="mr-2 h-4 w-4" />
          Download All (ZIP)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.config.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted/50 p-4 flex items-center justify-center">
              <img
                src={asset.url}
                alt={asset.config.name}
                className="max-h-full max-w-full object-contain shadow-sm"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{asset.config.name}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {asset.config.width}x{asset.config.height}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {asset.config.description}
              </p>
              <div className="pt-2 text-xs text-muted-foreground font-mono">
                {asset.config.filename}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
