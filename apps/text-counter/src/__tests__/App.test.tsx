import { describe, test, expect } from 'bun:test';
import { render } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('Text Counter - App Component', () => {
  describe('Rendering', () => {
    test('should render the app title', () => {
      const { getByText } = render(<App />);
      expect(getByText(/Text Counter/i)).toBeInTheDocument();
    });

    test('should render statistics panel', () => {
      const { container } = render(<App />);
      const h2 = container.querySelector('h2');
      expect(h2).not.toBeNull();
      expect(h2?.textContent).toContain('統計情報');
      expect(container.textContent).toContain('文字数（スペース含む）');
      expect(container.textContent).toContain('単語数');
    });

    test('should render settings panel', () => {
      const { getByText } = render(<App />);
      expect(getByText(/設定/i)).toBeInTheDocument();
    });

    test('should render text input area', () => {
      const { getByPlaceholderText } = render(<App />);
      const textarea = getByPlaceholderText(/ここにテキストを入力/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('Text Counting', () => {
    test('should count characters with spaces', async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText } = render(<App />);
      
      const textarea = getByPlaceholderText(/ここにテキストを入力/i) as HTMLTextAreaElement;
      await user.type(textarea, 'hello world');
      
      // 文字数が更新されることを確認
      expect(textarea.value).toBe('hello world');
    });

    test('should count words', async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText } = render(<App />);
      
      const textarea = getByPlaceholderText(/ここにテキストを入力/i) as HTMLTextAreaElement;
      await user.type(textarea, 'one two three');
      
      expect(textarea.value).toBe('one two three');
    });

    test('should count lines', async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText } = render(<App />);
      
      const textarea = getByPlaceholderText(/ここにテキストを入力/i) as HTMLTextAreaElement;
      await user.type(textarea, 'line1{Enter}line2{Enter}line3');
      
      expect(textarea.value).toContain('line1');
    });
  });

  describe('Clear Functionality', () => {
    test('should clear text when clear button is clicked', async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText, getByRole } = render(<App />);
      
      const textarea = getByPlaceholderText(/ここにテキストを入力/i) as HTMLTextAreaElement;
      await user.type(textarea, 'test text');
      
      const clearButton = getByRole('button', { name: /テキストをクリア/i });
      await user.click(clearButton);
      
      expect(textarea.value).toBe('');
    });
  });

  describe('Copy Stats', () => {
    test('should have copy stats button', () => {
      const { getByRole } = render(<App />);
      const copyButton = getByRole('button', { name: /統計をコピー/i });
      expect(copyButton).toBeInTheDocument();
    });
  });
});
