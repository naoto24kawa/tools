import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { renderHook, act } from '../../../../../test-utils';
import { mockLocalStorage } from '../../../../../test-utils';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('should initialize with initial value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  test('should update value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
  });

  test('should persist value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('persisted');
    });
    
    const stored = mockLocalStorage.getItem('test-key');
    expect(stored).toBe(JSON.stringify('persisted'));
  });

  test('should load value from localStorage', () => {
    mockLocalStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  test('should handle objects', () => {
    const { result } = renderHook(() => 
      useLocalStorage('test-key', { name: 'test', value: 123 })
    );
    
    act(() => {
      result.current[1]({ name: 'updated', value: 456 });
    });
    
    expect(result.current[0]).toEqual({ name: 'updated', value: 456 });
  });

  test('should handle function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });

  test('should handle invalid JSON in localStorage', () => {
    mockLocalStorage.setItem('test-key', 'invalid-json');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    
    expect(result.current[0]).toBe('fallback');
  });

  test('should remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[2](); // remove
    });

    expect(mockLocalStorage.getItem('test-key')).toBeNull();
    expect(result.current[0]).toBe('initial');
  });

  test('should handle localStorage setItem error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // mockLocalStorage.setItemをスパイ
    const setItemSpy = jest.spyOn(mockLocalStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new value');
    });

    expect(consoleSpy).toHaveBeenCalled();
    
    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
