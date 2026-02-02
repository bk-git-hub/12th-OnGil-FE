import { useSyncExternalStore } from 'react';

// --- Core Storage Logic (Low-level) ---

const dispatchStorageEvent = (key: string, newValue: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
    window.dispatchEvent(new CustomEvent('local-storage', { detail: key }));
  }
};

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const onStorage = () => callback();
  window.addEventListener('storage', onStorage);
  window.addEventListener('local-storage', onStorage as EventListener);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('local-storage', onStorage as EventListener);
  };
};

const getServerSnapshot = () => '';

/**
 * Custom hook for interacting with localStorage.
 * 
 * @template T - The type of the stored value
 * @param key - The localStorage key
 * @param initialValue - The initial value if key doesn't exist
 * @returns A tuple containing the current value and a setter function
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (val: T) => void] {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(key) || '';
  };

  const storeValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  let parsedValue: T;
  try {
    parsedValue = storeValue ? JSON.parse(storeValue) : initialValue;
  } catch {
    parsedValue = initialValue;
  }

  const setValue = (value: T) => {
    const newValue = JSON.stringify(value);
    localStorage.setItem(key, newValue);
    dispatchStorageEvent(key, newValue);
  };

  return [parsedValue, setValue];
}

// --- Domain Logic: Recent Searches ---

const MAX_RECENT_SEARCHES = 10;
const STORAGE_KEY = 'recent-searches-v1';

/**
 * Custom hook for managing recent search history.
 * 
 * @returns An object containing:
 *   history - Array of recent search terms
 *   addSearch - Function to add a new search term
 *   removeSearch - Function to remove a specific search term
 *   clearHistory - Function to clear all search history
 */
export function useRecentSearches() {
  const [history, setHistory] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const addSearch = (term: string) => {
    if (!term.trim()) return;
    setHistory(
      [term, ...history.filter((t) => t !== term)].slice(
        0,
        MAX_RECENT_SEARCHES,
      ),
    );
  };

  const removeSearch = (term: string) => {
    setHistory(history.filter((t) => t !== term));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addSearch, removeSearch, clearHistory };
}
