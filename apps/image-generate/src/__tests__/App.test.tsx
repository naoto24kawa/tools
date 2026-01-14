import { describe, test, expect } from 'bun:test';
import { App } from '../App';

describe('Image Generate - App Component', () => {
  test('should export App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
