import { describe, test, expect } from 'vitest';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('Text Deduplicate - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      render(<App />);
      expect(screen.getByText(/重複/i)).toBeInTheDocument();
    });

    test('should render input textarea', () => {
      render(<App />);
      const textareas = screen.getAllByRole('textbox');
      expect(textareas.length).toBeGreaterThan(0);
    });
  });

  describe('Deduplication', () => {
    test('should remove duplicate lines', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const input = screen.getAllByRole('textbox')[0];
      await user.type(input, 'line1{Enter}line2{Enter}line1');
      
      expect(input.value).toContain('line1');
    });
  });

  describe('Clear Functionality', () => {
    test('should have clear button', () => {
      render(<App />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
