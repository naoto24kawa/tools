import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';

interface ExifField {
  tag: string;
  value: string;
}

function findApp1Marker(data: Uint8Array): { start: number; length: number } | null {
  // JPEG starts with FFD8, then look for APP1 (FFE1)
  if (data[0] !== 0xff || data[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < data.length - 4) {
    if (data[offset] !== 0xff) break;
    const marker = data[offset + 1];
    const length = (data[offset + 2] << 8) | data[offset + 3];

    if (marker === 0xe1) {
      return { start: offset, length: length + 2 };
    }

    offset += length + 2;
  }
  return null;
}

function readString(data: Uint8Array, offset: number, length: number): string {
  let str = '';
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  return str;
}

function parseBasicExif(data: Uint8Array): ExifField[] {
  const fields: ExifField[] = [];
  const app1 = findApp1Marker(data);
  if (!app1) return fields;

  fields.push({ tag: 'APP1 Marker', value: `Found at offset ${app1.start}` });
  fields.push({ tag: 'APP1 Size', value: `${app1.length} bytes` });

  // Check for "Exif\0\0" header
  const exifHeader = readString(data, app1.start + 4, 4);
  if (exifHeader === 'Exif') {
    fields.push({ tag: 'EXIF Header', value: 'Present' });

    const tiffStart = app1.start + 10;
    if (tiffStart + 8 < data.length) {
      const byteOrder = readString(data, tiffStart, 2);
      fields.push({
        tag: 'Byte Order',
        value: byteOrder === 'MM' ? 'Big Endian (Motorola)' : 'Little Endian (Intel)',
      });

      const isLE = byteOrder === 'II';

      const readUint16 = (off: number): number => {
        if (isLE) return data[off] | (data[off + 1] << 8);
        return (data[off] << 8) | data[off + 1];
      };

      const readUint32 = (off: number): number => {
        if (isLE) return data[off] | (data[off + 1] << 8) | (data[off + 2] << 16) | (data[off + 3] << 24);
        return (data[off] << 24) | (data[off + 1] << 16) | (data[off + 2] << 8) | data[off + 3];
      };

      const ifdOffset = readUint32(tiffStart + 4);
      const ifdStart = tiffStart + ifdOffset;
      if (ifdStart + 2 < data.length) {
        const entryCount = readUint16(ifdStart);
        fields.push({ tag: 'IFD Entry Count', value: entryCount.toString() });

        const TAG_NAMES: Record<number, string> = {
          0x010e: 'ImageDescription',
          0x010f: 'Make',
          0x0110: 'Model',
          0x0112: 'Orientation',
          0x011a: 'XResolution',
          0x011b: 'YResolution',
          0x0131: 'Software',
          0x0132: 'DateTime',
          0x013b: 'Artist',
          0x8769: 'ExifIFDPointer',
          0xa002: 'PixelXDimension',
          0xa003: 'PixelYDimension',
        };

        for (let i = 0; i < Math.min(entryCount, 50); i++) {
          const entryOff = ifdStart + 2 + i * 12;
          if (entryOff + 12 > data.length) break;

          const tag = readUint16(entryOff);
          const type = readUint16(entryOff + 2);
          const count = readUint32(entryOff + 4);
          const valueOff = entryOff + 8;

          const tagName = TAG_NAMES[tag] || `Tag 0x${tag.toString(16).padStart(4, '0')}`;

          let value = '';
          if (type === 2) {
            // ASCII
            if (count <= 4) {
              value = readString(data, valueOff, count);
            } else {
              const strOff = readUint32(valueOff);
              value = readString(data, tiffStart + strOff, Math.min(count, 100));
            }
          } else if (type === 3) {
            // SHORT
            value = readUint16(valueOff).toString();
          } else if (type === 4) {
            // LONG
            value = readUint32(valueOff).toString();
          } else {
            value = `(type ${type}, count ${count})`;
          }

          fields.push({ tag: tagName, value });
        }
      }
    }
  }

  return fields;
}

function removeExif(data: Uint8Array): Uint8Array {
  const app1 = findApp1Marker(data);
  if (!app1) return data;

  const before = data.slice(0, app1.start);
  const after = data.slice(app1.start + app1.length);

  const result = new Uint8Array(before.length + after.length);
  result.set(before, 0);
  result.set(after, before.length);
  return result;
}

export default function App() {
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState('');
  const [exifFields, setExifFields] = useState<ExifField[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/jpeg') && !file.name.toLowerCase().endsWith('.jpg') && !file.name.toLowerCase().endsWith('.jpeg')) {
      toast({ title: 'Please upload a JPEG file', variant: 'destructive' });
      return;
    }

    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    setFileData(data);
    setFileName(file.name);

    const fields = parseBasicExif(data);
    setExifFields(fields);

    const blob = new Blob([data], { type: 'image/jpeg' });
    setPreviewUrl(URL.createObjectURL(blob));

    toast({ title: `Loaded ${file.name}`, description: `${fields.length} EXIF fields found` });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveExif = () => {
    if (!fileData) return;

    const cleaned = removeExif(fileData);
    setFileData(cleaned);

    const fields = parseBasicExif(cleaned);
    setExifFields(fields);

    const blob = new Blob([cleaned], { type: 'image/jpeg' });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(blob));

    toast({ title: 'EXIF data removed' });
  };

  const handleDownload = () => {
    if (!fileData) return;

    const blob = new Blob([fileData], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleaned_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: 'File downloaded' });
  };

  const handleClear = () => {
    setFileData(null);
    setFileName('');
    setExifFields([]);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">EXIF Editor</h1>
          <p className="text-muted-foreground">
            Upload a JPEG file to view and remove EXIF metadata.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Upload JPEG</CardTitle>
            <CardDescription>Select a JPEG image to inspect its EXIF data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                {fileName || 'Upload a JPEG file'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {fileData && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>EXIF Fields ({exifFields.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveExif}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove EXIF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {exifFields.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No EXIF data found.</p>
                ) : (
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {exifFields.map((field, i) => (
                      <div key={`${field.tag}-${i}`} className="flex gap-2 p-2 rounded-md bg-muted text-sm">
                        <span className="font-medium min-w-[140px] shrink-0">{field.tag}</span>
                        <span className="text-muted-foreground font-mono break-all">{field.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Preview</CardTitle>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="JPEG Preview"
                    className="max-w-full max-h-[400px] object-contain rounded-md mx-auto"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
