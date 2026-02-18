import { Clock, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ClearHistoryModal from './clear-history-modal';

interface SearchDropdownProps {
  isVisible: boolean; // 부모의 isFocused 상태
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
  isVisible,
  query,
  recentSearches,
  recommendedKeywords,
  autocompleteResults,
  isLoading,
  onSelect,
  onRemoveRecent,
  onClear,
}: SearchDropdownProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!isVisible) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="absolute top-full left-0 z-110 -mt-2 w-full overflow-hidden border border-black bg-white py-2 shadow-xl ring-1 ring-black/5">
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
              추천 자동완성 검색어가 없습니다.
            </div>
          )}
        </div>
      )}

      {!hasQuery && (
        <div className="flex flex-col gap-4 text-lg font-medium">
          {recentSearches.length > 0 ? (
            <div className="max-h-75 overflow-y-scroll">
              <div className="flex justify-between px-6 py-2">
                <span>최근 검색어</span>
                <button
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => setIsModalOpen(true)}
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
                        alt="삭제"
                        width={20}
                        height={20}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            recommendedKeywords.length > 0 && (
              <div>
                <div className="px-4 py-2">추천 검색어</div>
                <div className="flex flex-wrap gap-2 px-4 pb-2">
                  {recommendedKeywords.map((tag) => (
                    <button
                      key={tag}
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={() => onSelect(tag)}
                      className="bg-ongil-mint text-ongil-teal border-ongil-teal flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-lg font-medium"
                    >
                      <TrendingUp size={18} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* 모달 Portal (기능 유지를 위해 필요) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => setIsModalOpen(false)}
            />
            <ClearHistoryModal
              onClear={() => {
                onClear();
                setIsModalOpen(false);
              }}
              onClose={() => setIsModalOpen(false)}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
