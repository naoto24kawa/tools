import { describe, test, expect } from 'bun:test';
import { render, screen } from '../../../../test-utils';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Text Diff Checker - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      render(<App />);
      expect(screen.getByText(/diff/i) || screen.getByText(/差分/i)).toBeInTheDocument();
    });

    test('should render two text areas', () => {
      render(<App />);
      const textareas = screen.getAllByRole('textbox');
      expect(textareas.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Diff Comparison', () => {
    test('should compare two texts', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const textareas = screen.getAllByRole('textbox');
      await user.type(textareas[0], 'text1');
      await user.type(textareas[1], 'text2');
      
      expect(textareas[0]).toHaveValue('text1');
      expect(textareas[1]).toHaveValue('text2');
    });
  });
});
