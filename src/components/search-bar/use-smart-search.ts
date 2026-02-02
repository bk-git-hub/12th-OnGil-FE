import { useState, useRef } from 'react';

// Mock DB
const MOCK_KEYWORDS = [
  'React 19',
  'Next.js 16',
  'Tailwind CSS',
  'Server Components',
  'React Compiler',
  'Zustand',
  'TanStack Query',
  'Framer Motion',
  'TypeScript',
  'Vercel',
  'Turbopack',
  'AI SDK',
];

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

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchRecommended = async () => {
    // 무작위 단어 추출
    const shuffled = [...MOCK_KEYWORDS].sort(() => 0.5 - Math.random());
    setRecommended(shuffled.slice(0, 5));
  };

  const fetchAutocomplete = (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // 임의 딜레이 설정
        await new Promise((resolve) => setTimeout(resolve, 200));

        const lowerQuery = query.toLowerCase();
        const results = MOCK_KEYWORDS.filter((k) =>
          k.toLowerCase().includes(lowerQuery),
        );
        setSuggestions(results);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms 디바운스
  };

  return {
    suggestions,
    recommended,
    isLoading,
    fetchRecommended,
    fetchAutocomplete,
  };
}
