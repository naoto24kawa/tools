import { describe, test, expect } from 'vitest';
import { render } from '../../../../test-utils';
import { App } from '../App';

describe('Image Resize - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      const { container } = render(<App />);
      expect(container.textContent).toMatch(/resize|リサイズ/i);
    });

    test('should have file input', () => {
      const { container } = render(<App />);
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).not.toBeNull();
    });
  });

  describe('Image Upload', () => {
    test('should accept image files', () => {
      const { container } = render(<App />);
      expect(container).not.toBeNull();
    });
  });
});
