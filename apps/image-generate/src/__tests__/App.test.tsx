import { describe, test, expect } from 'vitest';
import { App } from '../App';

describe('Image Generate - App Component', () => {
  test('should export App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
