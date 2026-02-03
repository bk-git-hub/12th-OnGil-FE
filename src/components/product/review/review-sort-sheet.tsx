'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';
import { SortOptionType } from '@/types/domain/review';
import { Button } from '@/components/ui/button';

// 리뷰 정렬 옵션 시트 컴포넌트

const SORT_OPTIONS: { value: SortOptionType; label: string }[] = [
  { value: 'best', label: '베스트 후기 순' },
  { value: 'newest', label: '최신순' },
  { value: 'highRating', label: '별점 높은 순' },
  { value: 'lowRating', label: '별점 낮은 순' },
];

// 개별 정렬 옵션 아이템 컴포넌트
interface SortOptionItemProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

function SortOptionItem({ label, isSelected, onSelect }: SortOptionItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left text-2xl leading-[20px]',
        isSelected ? 'font-bold text-black' : 'font-medium text-gray-500',
      )}
    >
      {label}
      {isSelected && <Check className="text-ongil-teal h-6 w-6" />}
    </button>
  );
}

// 메인 컴포넌트
interface ReviewSortSheetProps {
  currentSort: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
}

/**
 * 리뷰 정렬 옵션을 선택할 수 있는 시트 컴포넌트
 * @param {ReviewSortSheetProps} props - 컴포넌트 props
 * @param {SortOptionType} props.currentSort - 현재 선택된 정렬 옵션
 * @param {(sort: SortOptionType) => void} props.onSortChange - 정렬 옵션 변경 콜백
 * @returns {JSX.Element} 리뷰 정렬 시트 컴포넌트
 */
export default function ReviewSortSheet({
  currentSort,
  onSortChange,
}: ReviewSortSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 현재 선택된 라벨 찾기
  const currentLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label;
  const displayLabel = currentSort === 'best' ? '상품 정렬' : currentLabel;

  const handleSelect = (value: SortOptionType) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'bg-ongil-teal h-[61px] w-full max-w-[165px] justify-center gap-2 rounded-lg text-xl leading-normal font-semibold text-white not-italic',
          )}
        >
          {displayLabel}
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[486px] p-8">
        <div className="flex flex-col gap-4">
          {SORT_OPTIONS.map((option) => (
            <SortOptionItem
              key={option.value}
              label={option.label}
              isSelected={currentSort === option.value}
              onSelect={() => handleSelect(option.value)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
