---
name: component-patterns
description: Elchika Toolsで再利用可能なReactコンポーネントパターンとカスタムフックの実装例を提供します。設定パネル、入力コンポーネント（数値、セレクター、カラーピッカー、ファイルアップロード）、プレビューコンポーネント（画像、キャンバス、情報表示）、エクスポートパネル、カスタムフック（設定管理、画像読み込み、ローカルストレージ、デバウンス）の実装時に使用してください。コンポーネントの具体的な実装方法やベストプラクティスを学ぶために参照します。
---

# コンポーネントパターンサンプル集

このドキュメントでは、アプリケーションでよく使用されるコンポーネントパターンのサンプルを提供します。

## 目次

1. [設定パネルコンポーネント](#設定パネルコンポーネント)
2. [入力コンポーネント](#入力コンポーネント)
3. [プレビューコンポーネント](#プレビューコンポーネント)
4. [エクスポートコンポーネント](#エクスポートコンポーネント)
5. [カスタムフック](#カスタムフック)

---

## 設定パネルコンポーネント

### 基本的な設定パネル

```tsx
import { Card } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

interface SettingsPanelProps {
  settings: {
    width: number;
    height: number;
    format: 'png' | 'jpeg' | 'webp';
  };
  onSettingsChange: (settings: Partial<SettingsPanelProps['settings']>) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* サイズ設定 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">サイズ設定</h3>

          <div className="space-y-2">
            <Label htmlFor="width">幅 (px)</Label>
            <Input
              id="width"
              type="number"
              value={settings.width}
              onChange={(e) => onSettingsChange({ width: Number(e.target.value) })}
              min={1}
              max={10000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">高さ (px)</Label>
            <Input
              id="height"
              type="number"
              value={settings.height}
              onChange={(e) => onSettingsChange({ height: Number(e.target.value) })}
              min={1}
              max={10000}
            />
          </div>
        </div>

        {/* フォーマット設定 */}
        <div className="space-y-2">
          <Label htmlFor="format">フォーマット</Label>
          <Select
            value={settings.format}
            onValueChange={(value) => onSettingsChange({ format: value as 'png' | 'jpeg' | 'webp' })}
          >
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
```

### スクロール可能な設定パネル

```tsx
export function ScrollableSettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  return (
    <Card className="h-fit max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
      <div className="space-y-6">
        {/* 設定項目 */}
      </div>
    </Card>
  );
}
```

---

## 入力コンポーネント

### 数値入力コンポーネント

```tsx
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  unit,
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {unit && <span className="text-muted-foreground"> ({unit})</span>}
      </Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = Number(e.target.value);
          if (newValue >= min && newValue <= max) {
            onChange(newValue);
          }
        }}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
```

### セレクター付き入力コンポーネント

```tsx
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

interface Option {
  label: string;
  value: string;
}

interface SelectorProps {
  id: string;
  label: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Selector({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = '選択してください',
}: SelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

### カラーピッカーコンポーネント

```tsx
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';

interface ColorPreset {
  label: string;
  value: string;
}

interface ColorPickerProps {
  label: string;
  color: string;
  presets?: readonly ColorPreset[];
  onColorChange: (color: string) => void;
}

export function ColorPicker({ label, color, presets, onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* カラー入力 */}
      <div className="flex gap-2">
        <Input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-10 w-20 cursor-pointer"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="flex-1"
          placeholder="#000000"
        />
      </div>

      {/* プリセット */}
      {presets && presets.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">プリセット</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => onColorChange(preset.value)}
                className="gap-2"
              >
                <div
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### ファイルアップロードコンポーネント

```tsx
import { useRef } from 'react';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';

interface FileUploadProps {
  accept?: string[];
  maxSize?: number; // bytes
  onFileLoad: (file: File) => void;
  onError?: (error: string) => void;
}

export function FileUpload({
  accept = ['image/*'],
  maxSize = 10 * 1024 * 1024, // 10MB
  onFileLoad,
  onError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック
    if (file.size > maxSize) {
      onError?.(`ファイルサイズが大きすぎます（最大: ${(maxSize / 1024 / 1024).toFixed(0)}MB）`);
      return;
    }

    onFileLoad(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (file.size > maxSize) {
      onError?.(`ファイルサイズが大きすぎます（最大: ${(maxSize / 1024 / 1024).toFixed(0)}MB）`);
      return;
    }

    onFileLoad(file);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      <Card
        className="cursor-pointer border-2 border-dashed p-12 text-center transition-colors hover:border-primary"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="text-4xl">📁</div>
          <div>
            <p className="font-semibold">クリックまたはドラッグ＆ドロップ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {accept.join(', ')} / 最大 {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
          <Button variant="outline">ファイルを選択</Button>
        </div>
      </Card>
    </>
  );
}
```

---

## プレビューコンポーネント

### 画像プレビューコンポーネント

```tsx
import { Card } from '@components/ui/card';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function ImagePreview({ src, alt = 'プレビュー', width, height }: ImagePreviewProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">プレビュー</h3>

        <div className="flex items-center justify-center bg-muted p-4">
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="max-h-[600px] max-w-full object-contain"
          />
        </div>

        {width && height && (
          <div className="text-sm text-muted-foreground">
            サイズ: {width} × {height} px
          </div>
        )}
      </div>
    </Card>
  );
}
```

### キャンバスプレビューコンポーネント

```tsx
import { useRef, useEffect } from 'react';
import { Card } from '@components/ui/card';

interface CanvasPreviewProps {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

export function CanvasPreview({ width, height, draw }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, canvas);
  }, [width, height, draw]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">プレビュー</h3>

        <div className="flex items-center justify-center bg-muted p-4">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="max-h-[600px] max-w-full border"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          サイズ: {width} × {height} px
        </div>
      </div>
    </Card>
  );
}
```

### 情報表示コンポーネント

```tsx
import { Card } from '@components/ui/card';

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoPanelProps {
  title: string;
  items: InfoItem[];
}

export function InfoPanel({ title, items }: InfoPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between border-b pb-2 last:border-0">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

---

## エクスポートコンポーネント

### 基本的なエクスポートパネル

```tsx
import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  filename: string;
}

interface ExportPanelProps {
  onExport: (settings: ExportSettings) => void;
  defaultFilename?: string;
}

export function ExportPanel({ onExport, defaultFilename = 'image' }: ExportPanelProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'png',
    quality: 92,
    filename: defaultFilename,
  });

  const handleExport = () => {
    onExport(settings);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">エクスポート設定</h3>

        {/* ファイル名 */}
        <div className="space-y-2">
          <Label htmlFor="filename">ファイル名</Label>
          <Input
            id="filename"
            value={settings.filename}
            onChange={(e) => setSettings({ ...settings, filename: e.target.value })}
          />
        </div>

        {/* フォーマット */}
        <div className="space-y-2">
          <Label htmlFor="format">フォーマット</Label>
          <Select
            value={settings.format}
            onValueChange={(value) => setSettings({ ...settings, format: value as ExportSettings['format'] })}
          >
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 品質（JPEG/WebPのみ） */}
        {(settings.format === 'jpeg' || settings.format === 'webp') && (
          <div className="space-y-2">
            <Label htmlFor="quality">品質 ({settings.quality}%)</Label>
            <Input
              id="quality"
              type="range"
              min={1}
              max={100}
              value={settings.quality}
              onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
            />
          </div>
        )}

        {/* エクスポートボタン */}
        <Button onClick={handleExport} className="w-full" size="lg">
          ダウンロード
        </Button>
      </div>
    </Card>
  );
}
```

---

## カスタムフック

### 基本的な設定管理フック

```tsx
import { useState, useCallback } from 'react';

interface Settings {
  width: number;
  height: number;
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
}

export function useSettings(initialSettings: Settings) {
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}

// 使用例
export function App() {
  const { settings, updateSettings, resetSettings } = useSettings({
    width: 800,
    height: 600,
    format: 'png',
    quality: 92,
  });

  return (
    <div>
      <SettingsPanel settings={settings} onSettingsChange={updateSettings} />
      <Button onClick={resetSettings}>リセット</Button>
    </div>
  );
}
```

### 画像読み込みフック

```tsx
import { useState, useCallback } from 'react';

interface ImageState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  error?: string;
}

export function useImageLoader() {
  const [image, setImage] = useState<ImageState>({
    status: 'idle',
    src: '',
    naturalWidth: 0,
    naturalHeight: 0,
  });

  const loadImage = useCallback((file: File) => {
    setImage({ status: 'loading', src: '', naturalWidth: 0, naturalHeight: 0 });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          status: 'loaded',
          src: e.target?.result as string,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
      img.onerror = () => {
        setImage({
          status: 'error',
          src: '',
          naturalWidth: 0,
          naturalHeight: 0,
          error: '画像の読み込みに失敗しました',
        });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setImage({
        status: 'error',
        src: '',
        naturalWidth: 0,
        naturalHeight: 0,
        error: 'ファイルの読み込みに失敗しました',
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const resetImage = useCallback(() => {
    setImage({ status: 'idle', src: '', naturalWidth: 0, naturalHeight: 0 });
  }, []);

  return {
    image,
    loadImage,
    resetImage,
  };
}
```

### ローカルストレージフック

```tsx
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, value]);

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [value, setValue, remove] as const;
}
```

### デバウンスフック

```tsx
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用例
export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // 検索実行
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="検索..."
    />
  );
}
```

---

## まとめ

これらのコンポーネントパターンを組み合わせることで、統一された使いやすいアプリケーションを効率的に構築できます。

必要に応じてカスタマイズし、プロジェクトの要件に合わせて調整してください。
