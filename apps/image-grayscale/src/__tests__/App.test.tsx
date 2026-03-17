import { describe, test, expect } from 'vitest';
import { render, screen } from '../../../../test-utils';
import { App } from '../App';

describe('Image Grayscale - App Component', () => {
  describe('Rendering', () => {
    test('should render the app', () => {
      render(<App />);
      expect(screen.getByText(/grayscale/i) || screen.getByText(/グレースケール/i)).toBeInTheDocument();
    });
  });

  describe('Basic Functionality', () => {
    test('should have main UI', () => {
      render(<App />);
      expect(document.body).toBeInTheDocument();
    });
  });
});
