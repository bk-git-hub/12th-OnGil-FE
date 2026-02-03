'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { FilterState } from '@/types/domain/review';
import { ChevronDown } from 'lucide-react';

// 상품 옵션 필터 컴포넌트(색상/사이즈)

interface FilterGroupProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onToggle: (value: string) => void;
}

// 개별 필터 그룹 컴포넌트
function FilterGroup({
  title,
  items,
  selectedItems,
  onToggle,
}: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-[21px]">
      <h4 className="text-xl font-bold">{title}</h4>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <button
              type="button"
              key={item}
              onClick={() => onToggle(item)}
              className={cn(
                'border-ongil-teal h-[61px] w-[107px] rounded-xl border px-4 py-2 text-2xl transition-colors',
                isSelected ? 'bg-ongil-mint' : 'bg-white',
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 메인 컴포넌트
interface ReviewOptionSheetProps {
  availableSizes: string[];
  availableColors: string[];
  filters: FilterState;
  onApply: (newFilters: Partial<FilterState>) => void;
}

/**
 * 리뷰 필터 옵션(색상, 사이즈)을 선택할 수 있는 시트 컴포넌트
 * @param {ReviewOptionSheetProps} props - 컴포넌트 props
 * @param {string[]} props.availableSizes - 사용 가능한 사이즈 목록
 * @param {string[]} props.availableColors - 사용 가능한 색상 목록
 * @param {FilterState} props.filters - 현재 필터 상태
 * @param {(newFilters: Partial<FilterState>) => void} props.onApply - 필터 적용 콜백
 * @returns {JSX.Element} 리뷰 옵션 시트 컴포넌트
 */
export default function ReviewOptionSheet({
  availableSizes,
  availableColors,
  filters,
  onApply,
}: ReviewOptionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

  const toggleSelection = (key: 'sizes' | 'colors', value: string) => {
    setTempFilters((prev) => {
      const list = prev[key];
      const isSelected = list.includes(value);
      return {
        ...prev,
        [key]: isSelected
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
    });
  };

  const handleReset = () => {
    setTempFilters((prev) => ({ ...prev, sizes: [], colors: [] }));
  };

  const handleApply = () => {
    onApply({ sizes: tempFilters.sizes, colors: tempFilters.colors });
    setIsOpen(false);
  };

  // 버튼 라벨 생성 로직
  const selectedOptions = [...filters.colors, ...filters.sizes];
  const activeCount = selectedOptions.length;
  const buttonLabel =
    activeCount > 0 ? selectedOptions.join(', ') : '상품 옵션'; // 기본 라벨

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'bg-ongil-teal h-[61px] w-[165px] justify-center gap-2 rounded-lg text-xl leading-normal font-semibold text-white not-italic',
            activeCount > 0 && 'bg-ongil-teal font-bold text-white',
          )}
        >
          <span className="max-w-[120px] truncate text-center">
            {buttonLabel}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[627px] px-4 py-6">
        <div className="flex h-full flex-col px-5">
          <div className="flex flex-col gap-[57px]">
            {/* 1. 색상 선택 그룹 */}
            <FilterGroup
              title="색상"
              items={availableColors}
              selectedItems={tempFilters.colors}
              onToggle={(value) => toggleSelection('colors', value)}
            />

            {/* 2. 사이즈 선택 그룹 */}
            <FilterGroup
              title="사이즈"
              items={availableSizes}
              selectedItems={tempFilters.sizes}
              onToggle={(value) => toggleSelection('sizes', value)}
            />
          </div>

          <div className="mt-auto flex gap-[13px] pb-6">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-[76px] w-[143px] rounded-2xl bg-[#E7E7E7] text-2xl leading-normal font-bold not-italic"
            >
              초기화
            </Button>

            <Button
              onClick={handleApply}
              className="bg-ongil-teal h-[76px] w-[198px] rounded-2xl text-2xl leading-normal font-bold text-white not-italic"
            >
              보기
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
