import { useCallback, useEffect, useSyncExternalStore } from 'react';

const MAX_RECENT_SEARCHES = 10;
const EMPTY_SNAPSHOT: string[] = [];
const RECENT_SEARCHES_STORAGE_KEY = 'onsinsa:recent-searches';

let recentSearchesCache: string[] = [];
let isInitialized = false;

const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getSnapshot = () => recentSearchesCache;
const getServerSnapshot = () => EMPTY_SNAPSHOT;

const notify = () => {
  listeners.forEach((listener) => listener());
};

const normalizeKeywords = (keywords: string[]) =>
  Array.from(
    new Set(
      keywords
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0),
    ),
  );

const areSameKeywords = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const setRecentSearchesCache = (
  nextKeywords: string[],
  persistStorage: boolean,
) => {
  const normalized = normalizeKeywords(nextKeywords);
  const changed = !areSameKeywords(recentSearchesCache, normalized);

  recentSearchesCache = normalized;

  if (persistStorage && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(
        RECENT_SEARCHES_STORAGE_KEY,
        JSON.stringify(normalized),
      );
    } catch {
      // localStorage 접근 실패 시에도 메모리 캐시는 유지
    }
  }

  if (changed) {
    notify();
  }
};

const parseKeywordsFromStorage = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const value = (payload as { data?: unknown }).data;
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string =>
          typeof item === 'string' && item.trim().length > 0,
      );
    }
  }

  return [];
};

const loadRecentSearches = () => {
  if (typeof window === 'undefined') {
    return recentSearchesCache;
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    const keywords = parseKeywordsFromStorage(parsed).slice(0, MAX_RECENT_SEARCHES);
    setRecentSearchesCache(keywords, false);
    return recentSearchesCache;
  } catch {
    setRecentSearchesCache([], false);
    return recentSearchesCache;
  }
};

export function useRecentSearches() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!isInitialized) {
      loadRecentSearches();
      isInitialized = true;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === RECENT_SEARCHES_STORAGE_KEY) {
        loadRecentSearches();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const addSearch = useCallback((term: string) => {
    const keyword = term.trim();
    if (!keyword) return;

    const nextKeywords = [
      keyword,
      ...recentSearchesCache.filter((item) => item !== keyword),
    ].slice(0, MAX_RECENT_SEARCHES);
    if (areSameKeywords(recentSearchesCache, nextKeywords)) {
      return;
    }

    setRecentSearchesCache(nextKeywords, true);
  }, []);

  const removeSearch = useCallback((term: string) => {
    const keyword = term.trim();
    if (!keyword) return;

    const nextKeywords = recentSearchesCache.filter((item) => item !== keyword);
    setRecentSearchesCache(nextKeywords, true);
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSearchesCache([], true);
  }, []);

  const refreshHistory = useCallback(() => {
    loadRecentSearches();
  }, []);

  return { history, addSearch, removeSearch, clearHistory, refreshHistory };
}
