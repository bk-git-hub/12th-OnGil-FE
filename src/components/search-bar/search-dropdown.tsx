import { Clock, TrendingUp, Search, X } from 'lucide-react';

interface SearchDropdownProps {
  isVisible: boolean;
  query: string;
  recentSearches: string[];
  recommendedKeywords: string[];
  autocompleteResults: string[];
  isLoading: boolean;
  onSelect: (term: string) => void;
  onRemoveRecent: (term: string) => void;
}

export const SearchDropdown = ({
  isVisible,
  query,
  recentSearches,
  recommendedKeywords,
  autocompleteResults,
  isLoading,
  onSelect,
  onRemoveRecent,
}: SearchDropdownProps) => {
  if (!isVisible) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="absolute top-full left-0 -mt-2 w-full overflow-hidden border border-black bg-white py-2 shadow-xl ring-1 ring-black/5">
      {hasQuery && (
        <div>
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">검색 중...</div>
          ) : autocompleteResults.length > 0 ? (
            <ul>
              {autocompleteResults.map((item, idx) => (
                <li key={idx}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(item)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <Search className="text-gray-400" size={16} />
                    <span className="text-gray-700">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 2. Discovery Mode (Recent + Recommended) */}
      {!hasQuery && (
        <div className="flex flex-col gap-4 text-lg font-medium">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="max-h-75 overflow-y-scroll">
              <div className="px-4 py-2">최근 검색어</div>
              <ul className="divide-y-black/23 divide-y">
                {recentSearches.map((term) => (
                  <li
                    key={term}
                    className="group flex items-center justify-between px-4 py-4"
                  >
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(term)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <Clock className="text-gray-400" size={16} />
                      <span className="truncate">{term}</span>
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecent(term);
                      }}
                      className="p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/*

         
          {recommendedKeywords.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400">
                추천 검색어
              </div>
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {recommendedKeywords.map((tag) => (
                  <button
                    key={tag}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(tag)}
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <TrendingUp size={14} />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}


*/
