import { Clock, TrendingUp, Search, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchDropdownProps {
  query: string;
  recentSearches: string[];
  recommendedKeywords: string[];
  autocompleteResults: string[];
  isLoading: boolean;
  onSelect: (term: string) => void;
  onRemoveRecent: (term: string) => void;
  onClear: () => void;
}

export const SearchDropdown = ({
  query,
  recentSearches,
  recommendedKeywords,
  autocompleteResults,
  isLoading,
  onSelect,
  onRemoveRecent,
  onClear,
}: SearchDropdownProps) => {
  const hasQuery = query.trim().length > 0;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="absolute top-full left-0 z-40 -mt-2 w-full overflow-hidden border border-black bg-white py-2 shadow-xl ring-1 ring-black/5">
      {hasQuery && (
        <div>
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">검색 중...</div>
          ) : autocompleteResults.length > 0 ? (
            <ul>
              {autocompleteResults.map((item, idx) => (
                <li key={idx}>
                  <button
                    onPointerDown={(e) => e.preventDefault()}
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
              <div className="flex justify-between px-6 py-2">
                <span>최근 검색어</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  onPointerDown={(e) => e.preventDefault()}
                  className="text-black/47"
                >
                  전체 삭제
                </button>
              </div>
              <ul className="divide-y-black/23 divide-y">
                {recentSearches.map((term) => (
                  <li
                    key={term}
                    className="group flex w-full items-center justify-between p-4"
                  >
                    <button
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(term)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <Clock className="text-gray-400" size={16} />
                      <span className="truncate">{term}</span>
                    </button>
                    <button
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecent(term);
                      }}
                      className="p-0.5"
                    >
                      <img
                        src="/icons/delete.svg"
                        alt="검색어 삭제"
                        width={20}
                        height={20}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* 어두운 오버레이 */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => setIsModalOpen(false)}
            />

            {/* 모달 본체 */}
            <div className="animate-in fade-in zoom-in relative z-101 w-full max-w-[320px] transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  검색 기록 삭제
                </h3>
                <p className="mb-6 text-sm leading-relaxed font-normal text-gray-500">
                  모든 최근 검색 기록이 삭제됩니다.
                  <br />
                  정말 진행하시겠습니까?
                </p>

                <div className="flex w-full gap-3">
                  <button
                    type="button"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onClear();
                      setIsModalOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
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
                    onPointerDown={(e) => e.preventDefault()}
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
