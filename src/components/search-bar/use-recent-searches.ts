// hooks/use-local-storage.ts
import { useSyncExternalStore } from 'react';

// A custom event to notify subscribers when storage changes
const dispatchStorageEvent = (key: string, newValue: string) => {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
  // Also dispatch a custom event for the current tab to react
  window.dispatchEvent(new CustomEvent('local-storage', { detail: key }));
};

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => callback();
  const onCustom = (event: CustomEvent) => callback(); // For same-tab updates

  window.addEventListener('storage', onStorage);
  window.addEventListener('local-storage', onCustom as EventListener);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('local-storage', onCustom as EventListener);
  };
};

const getServerSnapshot = () => ''; // Server sees empty string

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (val: T) => void] {
  // 1. Read function (Client)
  const getSnapshot = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(key) || '';
  };

  // 2. The Magic: Syncs external store to React state
  const storeValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // 3. Parse JSON
  const parsedValue: T = storeValue ? JSON.parse(storeValue) : initialValue;

  // 4. Setter function
  const setValue = (value: T) => {
    const newValue = JSON.stringify(value);
    localStorage.setItem(key, newValue);
    dispatchStorageEvent(key, newValue); // Notify subscribers
  };

  return [parsedValue, setValue];
}
