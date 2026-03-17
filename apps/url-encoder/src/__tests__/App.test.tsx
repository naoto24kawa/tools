import { describe, test, expect } from 'vitest';
import { render, screen, waitFor } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('URL Encoder - App Component', () => {
  describe('Rendering', () => {
    test('should render the app title', () => {
      render(<App />);
      expect(screen.getByText(/URL Encoder \/ Decoder/i)).toBeInTheDocument();
    });

    test('should render input and output textareas', () => {
      render(<App />);
      
      const textareas = screen.getAllByRole('textbox');
      expect(textareas).toHaveLength(2);
      expect(textareas[0]).toHaveAttribute('id', 'input');
      expect(textareas[1]).toHaveAttribute('id', 'output');
    });

    test('should render encode and decode buttons', () => {
      render(<App />);
      
      expect(screen.getByRole('button', { name: /Encode/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Decode/i })).toBeInTheDocument();
    });

    test('should render clear and copy buttons', () => {
      render(<App />);
      
      expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Copy Result/i })).toBeInTheDocument();
    });
  });

  describe('Encoding Functionality', () => {
    test('should encode simple text', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      
      await user.type(input, 'hello world');
      await user.click(encodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('hello%20world');
      });
    });

    test('should encode URL with special characters', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      
      await user.type(input, 'https://example.com?q=test&foo=bar');
      await user.click(encodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('https%3A%2F%2Fexample.com%3Fq%3Dtest%26foo%3Dbar');
      });
    });

    test('should encode Japanese characters', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      
      await user.type(input, 'こんにちは');
      await user.click(encodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output.value).toContain('%E3%81%93');
      });
    });
  });

  describe('Decoding Functionality', () => {
    test('should decode encoded text', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const decodeButton = screen.getByRole('button', { name: /Decode/i });
      
      await user.type(input, 'hello%20world');
      await user.click(decodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('hello world');
      });
    });

    test('should decode URL with encoded characters', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const decodeButton = screen.getByRole('button', { name: /Decode/i });
      
      await user.type(input, 'https%3A%2F%2Fexample.com%3Fq%3Dtest');
      await user.click(decodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('https://example.com?q=test');
      });
    });
  });

  describe('Button States', () => {
    test('encode button should be disabled when input is empty', () => {
      render(<App />);
      
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      expect(encodeButton).toBeDisabled();
    });

    test('decode button should be disabled when input is empty', () => {
      render(<App />);
      
      const decodeButton = screen.getByRole('button', { name: /Decode/i });
      expect(decodeButton).toBeDisabled();
    });

    test('copy button should be disabled when output is empty', () => {
      render(<App />);
      
      const copyButton = screen.getByRole('button', { name: /Copy Result/i });
      expect(copyButton).toBeDisabled();
    });

    test('buttons should be enabled when input has value', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      await user.type(input, 'test');
      
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      const decodeButton = screen.getByRole('button', { name: /Decode/i });
      
      expect(encodeButton).toBeEnabled();
      expect(decodeButton).toBeEnabled();
    });
  });

  describe('Clear Functionality', () => {
    test('should clear both input and output', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      const clearButton = screen.getByRole('button', { name: /Clear/i });
      
      await user.type(input, 'test');
      await user.click(encodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('test');
      });
      
      await user.click(clearButton);
      
      expect(input).toHaveValue('');
      expect(screen.getAllByRole('textbox')[1]).toHaveValue('');
    });
  });

  describe('Copy to Clipboard', () => {
    test('should copy output to clipboard', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      const encodeButton = screen.getByRole('button', { name: /Encode/i });
      
      await user.type(input, 'test');
      await user.click(encodeButton);
      
      await waitFor(() => {
        const output = screen.getAllByRole('textbox')[1];
        expect(output).toHaveValue('test');
      });
      
      const copyButton = screen.getByRole('button', { name: /Copy Result/i });
      await user.click(copyButton);
      
      // クリップボードAPIがモックされていることを確認
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
    });
  });
});
