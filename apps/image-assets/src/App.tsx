import { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AssetPreview } from './components/AssetPreview';
import { generateAssets, createZip, type GeneratedAsset } from './utils/assetGenerator';
import { Loader2 } from 'lucide-react';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);

  const handleImageSelect = useCallback(async (file: File) => {
    setIsGenerating(true);
    try {
      // Small delay to allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 100));
      const generated = await generateAssets(file);
      setAssets(generated);
    } catch (error) {
      console.error('Failed to generate assets:', error);
      alert('Failed to generate assets. Please try another image.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (assets.length === 0) return;

    try {
      const zipBlob = await createZip(assets);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image-assets.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create zip:', error);
      alert('Failed to create zip file.');
    }
  }, [assets]);

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* ツールトップへのリンク */}
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          {/* タイトル */}
          <h1 className="text-3xl font-bold tracking-tight">
            🖼️ Image Assets Generator
          </h1>
          {/* 説明文 */}
          <p className="mt-1 text-sm text-muted-foreground">
            画像から OGP、Favicon、Twitter Card、PWA アイコンを一括生成
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ImageUploader onImageSelect={handleImageSelect} />

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating assets...</p>
            </div>
          )}

          {!isGenerating && assets.length > 0 && (
            <AssetPreview
              assets={assets}
              onDownloadAll={handleDownloadAll}
              isGenerating={isGenerating}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
