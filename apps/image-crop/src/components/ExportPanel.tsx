import React, { useRef } from 'react';
import type { ExportSettings, PixelCrop, PreviewInfo } from '../types';
import { getCroppedImg, formatFileSize, calculateAspectRatio } from '../utils/cropCalculator';

interface ExportPanelProps {
  imageSrc: string;
  crop: PixelCrop;
  exportSettings: ExportSettings;
  onExportSettingsChange: (settings: ExportSettings) => void;
  previewInfo: PreviewInfo;
}

export function ExportPanel({
  imageSrc,
  crop,
  exportSettings,
  onExportSettingsChange,
  previewInfo,
}: ExportPanelProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleExport = async () => {
    if (!imgRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(
        imgRef.current,
        crop,
        exportSettings.format,
        exportSettings.quality
      );

      if (!blob) {
        alert('画像の処理に失敗しました');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportSettings.filename || `cropped-${Date.now()}.${exportSettings.format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('エクスポートに失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="controls-panel">
      <img
        ref={imgRef}
        src={imageSrc}
        alt=""
        style={{ display: 'none' }}
      />

      <div className="control-section">
        <h3>アスペクト比</h3>
        <div className="aspect-ratio-buttons">
          <button
            className="aspect-btn"
            onClick={() => onExportSettingsChange({ ...exportSettings })}
          >
            自由
          </button>
          <button
            className="aspect-btn"
            onClick={() => onExportSettingsChange({ ...exportSettings })}
          >
            1:1
          </button>
          <button
            className="aspect-btn"
            onClick={() => onExportSettingsChange({ ...exportSettings })}
          >
            4:3
          </button>
          <button
            className="aspect-btn"
            onClick={() => onExportSettingsChange({ ...exportSettings })}
          >
            16:9
          </button>
          <button
            className="aspect-btn"
            onClick={() => onExportSettingsChange({ ...exportSettings })}
          >
            3:2
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>エクスポート設定</h3>

        <div className="input-group">
          <label htmlFor="format-select">フォーマット</label>
          <select
            id="format-select"
            value={exportSettings.format}
            onChange={(e) =>
              onExportSettingsChange({
                ...exportSettings,
                format: e.target.value as 'jpeg' | 'png' | 'webp',
              })
            }
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        {(exportSettings.format === 'jpeg' || exportSettings.format === 'webp') && (
          <div className="input-group">
            <label htmlFor="quality-input">
              品質: {Math.round(exportSettings.quality * 100)}%
            </label>
            <input
              id="quality-input"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={exportSettings.quality}
              onChange={(e) =>
                onExportSettingsChange({
                  ...exportSettings,
                  quality: parseFloat(e.target.value),
                })
              }
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="filename-input">ファイル名</label>
          <input
            id="filename-input"
            type="text"
            value={exportSettings.filename}
            onChange={(e) =>
              onExportSettingsChange({
                ...exportSettings,
                filename: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="preview-info">
        <div className="preview-info-item">
          <span className="preview-info-label">元画像</span>
          <span className="preview-info-value">
            {previewInfo.originalSize.width} x {previewInfo.originalSize.height}px
          </span>
        </div>
        <div className="preview-info-item">
          <span className="preview-info-label">トリミング後</span>
          <span className="preview-info-value">
            {previewInfo.croppedSize.width} x {previewInfo.croppedSize.height}px
          </span>
        </div>
        <div className="preview-info-item">
          <span className="preview-info-label">アスペクト比</span>
          <span className="preview-info-value">{previewInfo.aspectRatio}</span>
        </div>
      </div>

      <button
        className="button button-primary"
        onClick={handleExport}
        disabled={isProcessing || !crop.width || !crop.height}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isProcessing ? 'エクスポート中...' : 'ダウンロード'}
      </button>
    </div>
  );
}
