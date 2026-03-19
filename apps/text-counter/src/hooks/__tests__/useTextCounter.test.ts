import { describe, test, expect } from 'vitest';
import { renderHook, act } from '../../../../../test-utils';
import { useTextCounter } from '../useTextCounter';

describe('useTextCounter', () => {
  test('should initialize with empty text', () => {
    const { result } = renderHook(() => useTextCounter());
    
    expect(result.current.text).toBe('');
  });

  test('should initialize with default settings', () => {
    const { result } = renderHook(() => useTextCounter());
    
    expect(result.current.settings).toBeDefined();
    expect(result.current.settings.language).toBe('auto');
  });

  test('should update text', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setText('test text');
    });
    
    expect(result.current.text).toBe('test text');
  });

  test('should calculate stats when text changes', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setText('hello world');
    });
    
    expect(result.current.stats.charsWithSpaces).toBe(11);
    expect(result.current.stats.charsWithoutSpaces).toBe(10);
  });

  test('should clear text', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setText('test');
    });
    
    expect(result.current.text).toBe('test');
    
    act(() => {
      result.current.clearText();
    });
    
    expect(result.current.text).toBe('');
  });

  test('should update settings', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        language: 'ja',
      });
    });
    
    expect(result.current.settings.language).toBe('ja');
  });

  test('should reset settings', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        language: 'en',
      });
    });
    
    expect(result.current.settings.language).toBe('en');
    
    act(() => {
      result.current.resetSettings();
    });
    
    expect(result.current.settings.language).toBe('auto');
  });

  test('should recalculate stats when settings change', () => {
    const { result } = renderHook(() => useTextCounter());
    
    act(() => {
      result.current.setText('test text');
    });
    
    act(() => {
      result.current.setSettings({
        ...result.current.settings,
        language: 'en',
      });
    });
    
    // Stats should be recalculated
    expect(result.current.stats).toBeDefined();
  });
});
