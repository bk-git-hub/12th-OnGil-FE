'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductSortType } from '@/types/enums';

const SORT_OPTIONS = [
  { value: ProductSortType.POPULAR, label: '인기순' },
  { value: ProductSortType.REVIEW, label: '후기순' },
  { value: ProductSortType.PRICE_LOW, label: '낮은 가격순' },
  { value: ProductSortType.PRICE_HIGH, label: '높은 가격순' },
];

export function ProductFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sortType') || ProductSortType.POPULAR;
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || '인기순';

  const handleSortChange = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortType', sortType);
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          <span>{currentLabel}</span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 바텀 시트 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* 바텀 시트 */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white transition-transform duration-300 ease-out">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">정렬</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                      currentSort === option.value
                        ? 'bg-gray-100 font-bold text-black'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
