'use client';

import { cn } from '@/lib/utils';

export type ReviewTabType = 'general' | 'month';

interface ReviewTabsProps {
  activeTab: ReviewTabType;
  onTabChange: (tab: ReviewTabType) => void;
  generalCount: number;
  monthCount: number;
}

export default function ReviewTabs({
  activeTab,
  onTabChange,
  generalCount,
  monthCount,
}: ReviewTabsProps) {
  return (
    <div className="bg-white px-4 pt-4">
      <div className="flex items-center border-y border-black px-4 py-4">
        <div className="flex-1">
          <button
            onClick={() => onTabChange('general')}
            className={cn(
              'w-full px-2 py-1 transition-colors',
              activeTab === 'general'
                ? 'font-bold text-[#1DAEFF]'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <div className="flex flex-col items-center text-2xl leading-[1.5] font-medium not-italic">
              <span className="break-keep whitespace-nowrap">전체 리뷰</span>
              <span className="break-keep whitespace-nowrap">
                ({generalCount}개)
              </span>
            </div>
          </button>
        </div>

        <div className="flex-1">
          <button
            onClick={() => onTabChange('month')}
            className={cn(
              'w-full px-2 py-1 transition-colors',
              activeTab === 'month'
                ? 'font-bold text-[#1DAEFF]'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <div className="flex flex-col items-center text-2xl leading-[1.5] font-medium not-italic">
              <span className="break-keep whitespace-nowrap">한달 후 리뷰</span>
              <span className="break-keep whitespace-nowrap">
                ({monthCount}개)
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
