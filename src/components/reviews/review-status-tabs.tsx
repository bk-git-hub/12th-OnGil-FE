'use client';

export type ReviewTab = 'writable' | 'written';

interface ReviewStatusTabsProps {
  writableCount: number;
  writtenCount: number;
  activeTab: ReviewTab;
  onTabChange: (tab: ReviewTab) => void;
}

export default function ReviewStatusTabs({
  writableCount,
  writtenCount,
  activeTab,
  onTabChange,
}: ReviewStatusTabsProps) {
  const safeWritableCount =
    Number.isFinite(writableCount) && writableCount >= 0 ? writableCount : 0;
  const safeWrittenCount =
    Number.isFinite(writtenCount) && writtenCount >= 0 ? writtenCount : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[#d1d1d1] bg-[#efefef]">
      <div className="grid grid-cols-2">
        <button
          type="button"
          className={`border-r border-[#d1d1d1] px-4 py-3 text-center text-base leading-tight ${
            activeTab === 'writable'
              ? 'bg-white font-semibold text-black'
              : 'font-medium text-[#9a9a9a]'
          }`}
          aria-pressed={activeTab === 'writable'}
          onClick={() => onTabChange('writable')}
        >
          쓸 수 있는 후기
          <br />({safeWritableCount}개)
        </button>
        <button
          type="button"
          className={`px-4 py-3 text-center text-base leading-tight ${
            activeTab === 'written'
              ? 'bg-white font-semibold text-black'
              : 'font-medium text-[#9a9a9a]'
          }`}
          aria-pressed={activeTab === 'written'}
          onClick={() => onTabChange('written')}
        >
          내가 쓴 후기
          <br />({safeWrittenCount}개)
        </button>
      </div>
    </div>
  );
}
