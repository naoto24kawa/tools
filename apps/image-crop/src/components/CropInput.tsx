import React from 'react';
import type { Crop } from '../types';

interface CropInputProps {
  crop: Crop;
  imageSize: { width: number; height: number };
  onCropChange: (crop: Crop) => void;
}

export function CropInput({ crop, imageSize, onCropChange }: CropInputProps) {
  const handleChange = (field: keyof Crop, value: string) => {
    const numValue = parseFloat(value) || 0;
    onCropChange({ ...crop, [field]: numValue });
  };

  const handleUnitChange = (unit: 'px' | '%') => {
    if (crop.unit === unit) return;

    if (unit === 'px') {
      // % -> px
      onCropChange({
        x: (crop.x / 100) * imageSize.width,
        y: (crop.y / 100) * imageSize.height,
        width: (crop.width / 100) * imageSize.width,
        height: (crop.height / 100) * imageSize.height,
        unit: 'px',
      });
    } else {
      // px -> %
      onCropChange({
        x: (crop.x / imageSize.width) * 100,
        y: (crop.y / imageSize.height) * 100,
        width: (crop.width / imageSize.width) * 100,
        height: (crop.height / imageSize.height) * 100,
        unit: '%',
      });
    }
  };

  return (
    <div className="control-section">
      <h3>座標・サイズ調整</h3>

      <div className="input-group">
        <label htmlFor="unit-select">単位</label>
        <select
          id="unit-select"
          value={crop.unit}
          onChange={(e) => handleUnitChange(e.target.value as 'px' | '%')}
        >
          <option value="px">ピクセル (px)</option>
          <option value="%">パーセント (%)</option>
        </select>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="crop-x">X座標</label>
          <input
            id="crop-x"
            type="number"
            value={Math.round(crop.x)}
            onChange={(e) => handleChange('x', e.target.value)}
            min="0"
            step="1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="crop-y">Y座標</label>
          <input
            id="crop-y"
            type="number"
            value={Math.round(crop.y)}
            onChange={(e) => handleChange('y', e.target.value)}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="crop-width">幅</label>
          <input
            id="crop-width"
            type="number"
            value={Math.round(crop.width)}
            onChange={(e) => handleChange('width', e.target.value)}
            min="1"
            step="1"
          />
        </div>
        <div className="input-group">
          <label htmlFor="crop-height">高さ</label>
          <input
            id="crop-height"
            type="number"
            value={Math.round(crop.height)}
            onChange={(e) => handleChange('height', e.target.value)}
            min="1"
            step="1"
          />
        </div>
      </div>
    </div>
  );
}
