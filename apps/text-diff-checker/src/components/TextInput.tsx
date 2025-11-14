import { useRef } from 'react';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { Upload } from 'lucide-react';
import { loadTextFile } from '@services/fileLoader';
import { toast } from '@hooks/useToast';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  onFileLoad: (text: string) => void;
  placeholder?: string;
}

export function TextInput({ label, value, onChange, onFileLoad, placeholder }: TextInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await loadTextFile(file);
      onFileLoad(text);
      toast({
        title: 'ファイルを読み込みました',
        description: `${file.name} を読み込みました`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'ファイルの読み込みに失敗しました',
        variant: 'destructive',
      });
    }

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const lineCount = value.split('\n').length;
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={label}>{label}</Label>
        <Button variant="outline" size="sm" onClick={handleFileClick}>
          <Upload className="mr-2 h-4 w-4" />
          ファイル
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.py,.html,.css,.scss,.sass,.less,.xml,.yaml,.yml,text/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] font-mono text-sm"
      />
      <div className="text-xs text-muted-foreground">
        {charCount} 文字 / {lineCount} 行
      </div>
    </div>
  );
}
