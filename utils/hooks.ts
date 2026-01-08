import { useEffect, useCallback, useState, useRef } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * Requires exact modifier match - unspecified modifiers must be false
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }
) {
  // Use ref to maintain callback freshness without re-registering event listeners on every render
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the key matches
      if (event.key.toLowerCase() !== key.toLowerCase()) {
        return;
      }

      // If no modifiers specified, match only when no modifiers are pressed
      if (!modifiers) {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          callbackRef.current();
        }
        return;
      }

      // Check exact modifier match - unspecified modifiers must be false
      const ctrlMatch = modifiers.ctrl !== undefined ? event.ctrlKey === modifiers.ctrl : !event.ctrlKey;
      const shiftMatch = modifiers.shift !== undefined ? event.shiftKey === modifiers.shift : !event.shiftKey;
      const altMatch = modifiers.alt !== undefined ? event.altKey === modifiers.alt : !event.altKey;
      const metaMatch = modifiers.meta !== undefined ? event.metaKey === modifiers.meta : !event.metaKey;

      if (ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault();
        callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [key, modifiers]); // callback not in dependencies - we use ref instead
}

/**
 * Custom hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for local storage with state
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
