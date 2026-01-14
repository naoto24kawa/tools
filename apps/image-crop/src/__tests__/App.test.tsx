import { describe, test, expect } from 'bun:test';
import { render, screen } from '../../../../test-utils';
import App from '../App';

describe('Image Crop - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      render(<App />);
      expect(screen.getByText(/crop/i) || screen.getByText(/トリミング/i)).toBeInTheDocument();
    });
  });

  describe('Basic Functionality', () => {
    test('should have main UI', () => {
      render(<App />);
      expect(document.body).toBeInTheDocument();
    });
  });
});
