import { TextInput } from './TextInput';

interface TextInputPanelProps {
  originalText: string;
  modifiedText: string;
  onOriginalTextChange: (text: string) => void;
  onModifiedTextChange: (text: string) => void;
  onFileLoad: (text: string, target: 'original' | 'modified') => void;
}

export function TextInputPanel({
  originalText,
  modifiedText,
  onOriginalTextChange,
  onModifiedTextChange,
  onFileLoad,
}: TextInputPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TextInput
        label="Original Text"
        value={originalText}
        onChange={onOriginalTextChange}
        onFileLoad={(text) => onFileLoad(text, 'original')}
        placeholder="元のテキストを入力..."
      />
      <TextInput
        label="Modified Text"
        value={modifiedText}
        onChange={onModifiedTextChange}
        onFileLoad={(text) => onFileLoad(text, 'modified')}
        placeholder="変更後のテキストを入力..."
      />
    </div>
  );
}
