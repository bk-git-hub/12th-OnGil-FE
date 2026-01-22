'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { VoiceOverlay } from './voice-overlay';
import { useRecentSearches } from './use-recent-searches';
import { useSmartSearch } from './use-smart-search';
import { SearchDropdown } from './search-dropdown';

const SEARCH_BAR_PLACEHOLDER = '찾고싶은 상품을 검색해요';

interface SearchBarProps {
  onFocusChange?: (isFocused: boolean) => void;
}

export default function SearchBar({ onFocusChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { history, addSearch, removeSearch, clearHistory } =
    useRecentSearches();
  const {
    suggestions,
    recommended,
    isLoading,
    fetchAutocomplete,
    fetchRecommended,
  } = useSmartSearch();

  const updateFocus = (focused: boolean) => {
    setIsFocused(focused);
    onFocusChange?.(focused);
  };

  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    setQuery(text);
    addSearch(text);
    inputRef.current?.blur();
    updateFocus(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    fetchAutocomplete(e.target.value);
  };

  return (
    // 'flex-1' allows this component to naturally fill all available space
    <div className="relative z-50 flex-1">
      {isVoiceActive && (
        <VoiceOverlay
          onClose={() => setIsVoiceActive(false)}
          onFinalResult={(text) => handleSearch(text)}
        />
      )}
      <div
        className={`bg-secondary-gray height-[45px] relative flex min-w-60.5 items-center rounded-lg border border-black px-3 py-3 transition-all duration-100 focus-within:z-50 focus-within:bg-white focus:w-full`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-1 gap-2"
        >
          <button type="button" onClick={() => handleSearch(query)}>
            <img src="/icons/search.svg" alt="검색" width={14} height={15} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              updateFocus(true);
              if (recommended.length === 0) fetchRecommended();
            }}
            onBlur={() => updateFocus(false)}
            placeholder={SEARCH_BAR_PLACEHOLDER}
            className="font-pretendard w-full flex-1 bg-transparent font-medium text-gray-900 placeholder:text-black/45 focus:outline-none"
            autoComplete="off"
          />
        </form>

        <div className="flex items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-200"
            >
              <X size={20} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsVoiceActive(true)}
            className="rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600"
          >
            <img src="/icons/mic.svg" alt="음성검색" />
          </button>
        </div>
      </div>
      {isFocused && (
        <SearchDropdown
          query={query}
          recentSearches={history}
          recommendedKeywords={recommended}
          autocompleteResults={suggestions}
          isLoading={isLoading}
          onSelect={handleSearch}
          onRemoveRecent={removeSearch}
          onClear={clearHistory}
        />
      )}
    </div>
  );
}
