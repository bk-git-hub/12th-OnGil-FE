'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductSortType } from '@/types/enums';

const SORT_OPTIONS: { value: ProductSortType; label: string }[] = [
  { value: ProductSortType.POPULAR, label: '인기순' },
  { value: ProductSortType.REVIEW, label: '리뷰 많은순' },
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

  const handleSortChange = (sortType: ProductSortType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortType', sortType);
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          type="button"
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
            className="fixed inset-0 z-50 bg-black/10"
            onClick={() => setIsOpen(false)}
          />

          {/* 바텀 시트 */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] bg-white px-6 pt-6 pb-10 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out">
            <div className="mx-auto w-full max-w-7xl">
              <div className="relative mb-8 flex items-center justify-center">
                <h3 className="text-[34px] leading-none font-bold text-black">정렬</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#707070] text-[#707070] hover:bg-gray-50"
                  aria-label="정렬 시트 닫기"
                >
                  <svg
                    className="h-5 w-5"
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

              <div className="space-y-8">
                {SORT_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border-2 ${
                        currentSort === option.value
                          ? 'border-ongil-teal bg-ongil-teal text-white'
                          : 'border-ongil-teal bg-transparent text-transparent'
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-[40px] leading-none font-bold text-black">
                      {option.label}
                    </span>
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
