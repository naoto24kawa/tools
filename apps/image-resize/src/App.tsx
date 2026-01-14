import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { FILE_SIZE_PRESETS } from './config/constants';
import { useResizeState } from './hooks/useResizeState';
import { downloadBlob, formatFileSize, generateFilename } from './utils/exportImage';

export function App() {
  const {
    image,
    status,
    resizeSettings,
    exportSettings,
    resizeResult,
    error,
    handleImageLoad,
    handleResize,
    setResizeSettings,
    setExportSettings,
    resetImage,
  } = useResizeState();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageLoad(file);
    }
  };

  const handleDownload = () => {
    if (resizeResult && image) {
      const filename = generateFilename(
        exportSettings.filenamePattern,
        image.file.name,
        resizeResult.width,
        resizeResult.height,
        exportSettings.format
      );
      downloadBlob(resizeResult.blob, filename);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">📐 Image Resize</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            画像を拡大・縮小。パーセント、ピクセル、ファイルサイズで指定可能。
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">画像を選択</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              {image && (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-2">元画像サイズ</h3>
                    <p className="text-sm text-muted-foreground">
                      {image.naturalWidth} × {image.naturalHeight} px
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">リサイズ方法</h3>
                    <select
                      value={resizeSettings.method}
                      onChange={(e) =>
                        setResizeSettings({
                          ...resizeSettings,
                          method: e.target.value as 'percent' | 'pixel' | 'filesize',
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="percent">パーセント指定</option>
                      <option value="pixel">ピクセル指定</option>
                      <option value="filesize">ファイルサイズ指定</option>
                    </select>
                  </div>

                  {resizeSettings.method === 'percent' && (
                    <div>
                      <label htmlFor="scale-percent" className="text-sm font-medium mb-2 block">
                        スケール: {resizeSettings.percent}%
                      </label>
                      <input
                        id="scale-percent"
                        type="range"
                        min="1"
                        max="200"
                        value={resizeSettings.percent}
                        onChange={(e) =>
                          setResizeSettings({
                            ...resizeSettings,
                            percent: Number(e.target.value),
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  )}

                  {resizeSettings.method === 'pixel' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="resize-width" className="text-sm font-medium mb-2 block">
                          幅 (px)
                        </label>
                        <input
                          id="resize-width"
                          type="number"
                          value={resizeSettings.width}
                          onChange={(e) =>
                            setResizeSettings({
                              ...resizeSettings,
                              width: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label htmlFor="resize-height" className="text-sm font-medium mb-2 block">
                          高さ (px)
                        </label>
                        <input
                          id="resize-height"
                          type="number"
                          value={resizeSettings.height}
                          onChange={(e) =>
                            setResizeSettings({
                              ...resizeSettings,
                              height: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={resizeSettings.maintainAspectRatio}
                            onChange={(e) =>
                              setResizeSettings({
                                ...resizeSettings,
                                maintainAspectRatio: e.target.checked,
                              })
                            }
                          />
                          <span className="text-sm">アスペクト比を維持</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {resizeSettings.method === 'filesize' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="target-filesize" className="text-sm font-medium mb-2 block">
                          目標ファイルサイズ (KB)
                        </label>
                        <input
                          id="target-filesize"
                          type="number"
                          value={Math.round(resizeSettings.targetFileSize / 1024)}
                          onChange={(e) =>
                            setResizeSettings({
                              ...resizeSettings,
                              targetFileSize: Number(e.target.value) * 1024,
                            })
                          }
                          className="w-full p-2 border rounded"
                          placeholder="KB単位で入力"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(resizeSettings.targetFileSize)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">プリセット</p>
                        <div className="flex flex-wrap gap-2">
                          {FILE_SIZE_PRESETS.map((preset) => (
                            <Button
                              key={preset.value}
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setResizeSettings({
                                  ...resizeSettings,
                                  targetFileSize: preset.value,
                                })
                              }
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-2">フォーマット</h3>
                    <select
                      value={exportSettings.format}
                      onChange={(e) =>
                        setExportSettings({
                          ...exportSettings,
                          format: e.target.value as 'png' | 'jpeg' | 'webp',
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleResize}
                    className="w-full"
                    disabled={status === 'processing'}
                  >
                    {status === 'processing' ? 'リサイズ中...' : 'リサイズ実行'}
                  </Button>

                  {resizeResult && (
                    <Button onClick={handleDownload} className="w-full" variant="outline">
                      ダウンロード
                    </Button>
                  )}

                  <Button onClick={resetImage} variant="outline" className="w-full">
                    別の画像を選択
                  </Button>
                </>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </Card>

          <Card className="p-6">
            {image ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">プレビュー</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">元画像</h3>
                    <img src={image.src} alt="Original" className="max-w-full border" />
                  </div>
                  {resizeResult && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        リサイズ後 ({resizeResult.width} × {resizeResult.height} px)
                      </h3>
                      <img
                        src={URL.createObjectURL(resizeResult.blob)}
                        alt="Resized"
                        className="max-w-full border"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">画像を選択してください</p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
