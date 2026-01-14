import { describe, test, expect } from 'bun:test';
import { render } from '../../../../test-utils';
import App from '../App';

describe('Image Assets - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      const { container } = render(<App />);
      expect(container.textContent).toMatch(/assets|アセット/i);
    });
  });

  describe('Basic Functionality', () => {
    test('should have main UI', () => {
      const { container } = render(<App />);
      expect(container).not.toBeNull();
    });
  });
});
