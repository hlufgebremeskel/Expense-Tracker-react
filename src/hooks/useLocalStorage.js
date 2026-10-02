import { useState, useEffect } from 'react';

// A custom hook that behaves like useState, but synchronizes with localStorage
export function useLocalStorage(key, initialValue) {
  // State to store our value. We pass an initializer function to useState 
  // so logic is only executed once.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g., corrupted JSON), fallback to initialValue
      console.warn("Error reading localStorage", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that 
  // persists the new value to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
