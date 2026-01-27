import { Clock } from 'lucide-react';

interface RecentSearchListProps {
  recentSearches: string[];
}

export default function RecentSearchList({
  recentSearches,
}: RecentSearchListProps) {
  return (
    <ul className="divide-y-black/23 divide-y">
      {/* {recentSearches.map((term) => (
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
                ))} */}
    </ul>
  );
}
