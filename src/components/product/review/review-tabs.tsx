'use client';

import { cn } from '@/lib/utils';

export type ReviewTabType = 'general' | 'month';

interface ReviewTabsProps {
  activeTab: ReviewTabType;
  onTabChange: (tab: ReviewTabType) => void;
  generalCount: number;
  monthCount: number;
}

export function ReviewTabs({
  activeTab,
  onTabChange,
  generalCount,
  monthCount,
}: ReviewTabsProps) {
  return (
    <div className="sticky top-40 z-20 bg-white px-4 pt-4">
      <div className="flex items-center gap-17 border-y border-black px-4 py-4">
        <div className="px-5">
          <button
            onClick={() => onTabChange('general')}
            className={cn(
              'px-2 py-1 text-[15px] transition-colors',
              activeTab === 'general'
                ? 'font-bold text-[#1DAEFF]'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <div className="text-2xl leading-[1.5] flex flex-col items-center font-medium not-italic">
              <span>전체 리뷰</span>
              <span>({generalCount}개)</span>
            </div>
          </button>
        </div>

        <div className="px-5">
          <button
            onClick={() => onTabChange('month')}
            className={cn(
              'px-2 py-1 text-[15px] transition-colors',
              activeTab === 'month'
                ? 'font-bold text-[#1DAEFF]'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <div className="text-2xl leading-[1.5] flex flex-col items-center font-medium not-italic">
              <span>한달 후 리뷰</span>
              <span>({monthCount}개)</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
