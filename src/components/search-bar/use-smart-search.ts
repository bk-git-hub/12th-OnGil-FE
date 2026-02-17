import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for smart search functionality.
 * Provides autocomplete suggestions and recommended keywords.
 * 
 * @returns An object containing:
 *   suggestions - Autocomplete suggestions based on query
 *   recommended - Recommended keywords
 *   isLoading - Loading state for autocomplete
 *   fetchRecommended - Function to fetch recommended keywords
 *   fetchAutocomplete - Function to fetch autocomplete suggestions
 */
export function useSmartSearch() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchRecommended = async () => {
    try {
      const response = await fetch('/api/search/recommend', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('추천 검색어 조회 실패');
      }

      const payload = (await response.json()) as string[] | { data?: string[] };
      const keywords = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.data)
          ? payload.data
          : [];

      const normalized = Array.from(
        new Set(
          keywords
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
        ),
      );

      if (normalized.length > 0) {
        setRecommended(normalized.slice(0, 10));
        return;
      }
    } catch {
      setRecommended([]);
    }
  };

  const normalizeSuggestions = (
    input: string[] | { data?: string[] },
    query: string,
  ) => {
    const source = Array.isArray(input)
      ? input
      : Array.isArray(input?.data)
        ? input.data
        : [];
    const normalizedQuery = query.trim().toLowerCase();

    // 백엔드가 query를 무시하고 고정 리스트를 내려도 프론트에서 재필터링
    const filtered = source
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .filter((item) => item.toLowerCase().includes(normalizedQuery));

    // 중복 제거
    const deduped = Array.from(new Set(filtered));
    if (deduped.length > 0) {
      return deduped;
    }

    // API 결과가 비정상/빈값이면 빈 배열
    return [];
  };

  const fetchAutocomplete = (query: string) => {
    if (!query.trim()) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      abortControllerRef.current?.abort();
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    abortControllerRef.current?.abort();

    debounceTimerRef.current = setTimeout(async () => {
      const currentRequestId = ++requestIdRef.current;
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search/autocomplete?query=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          if (currentRequestId === requestIdRef.current) {
            setSuggestions([]);
          }
          return;
        }

        const payload = (await response.json()) as string[] | { data?: string[] };
        const nextSuggestions = normalizeSuggestions(payload, query);

        if (currentRequestId === requestIdRef.current) {
          setSuggestions(nextSuggestions);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        if (currentRequestId === requestIdRef.current) {
          setSuggestions([]);
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }, 120); // 120ms 디바운스
  };

  return {
    suggestions,
    recommended,
    isLoading,
    fetchRecommended,
    fetchAutocomplete,
  };
}
