'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReviewCategorySummary } from '@/types/domain/review';
import { EVALUATION_MAP } from './review-constants';

interface AnalysisContentProps {
  category: string;
  title?: string;
  subtitle?: string;
  stat: ReviewCategorySummary;
  maxItems?: number;
  emptyMessageVariant?: 'size' | 'color' | 'default';
  selectedOption?: string;
  filterOptions?: string[];
  isLoading?: boolean;
  onOptionChange?: (value: string) => void;
}

function getStatLabel(item: { label?: string; answer?: string }) {
  const raw = item.label ?? item.answer ?? '정보 없음';
  return EVALUATION_MAP[raw] ?? raw;
}

function getEmptyMessage(
  variant: 'size' | 'color' | 'default',
  selectedOption: string,
) {
  if (variant === 'size') {
    return '유사 체형의 후기가 아직 없어요.';
  }
  if (variant === 'color') {
    return `"${selectedOption}" 색상을 선택한 분의 후기가 없어요`;
  }
  return '아직 이 옵션을 고른 분들의 후기가 없어요';
}

export default function AnalysisContent({
  category,
  title,
  subtitle,
  stat,
  maxItems = 5,
  emptyMessageVariant = 'default',
  selectedOption = 'all',
  filterOptions = [],
  isLoading = false,
  onOptionChange,
}: AnalysisContentProps) {
  const sorted = [...(stat.answerStats ?? [])].sort(
    (a, b) => b.count - a.count,
  );
  const limitedDetails = [...sorted.slice(0, maxItems)];
  while (limitedDetails.length < maxItems) {
    limitedDetails.push({ answer: '정보 없음', count: 0, percentage: 0 });
  }

  const totalCount = limitedDetails.reduce((sum, item) => sum + item.count, 0);
  const isFiltered = selectedOption !== 'all';
  const isEmpty = totalCount === 0;

  return (
    <div className="flex w-full flex-col px-3 pb-2">
      <div className="mb-4 flex flex-col items-center">
        <h3 className="text-center text-[34px] leading-tight font-semibold text-[#004E57]">
          {title ?? category}
        </h3>
        {subtitle && (
          <p className="mt-1 text-center text-sm font-medium text-gray-500">
            {subtitle}
          </p>
        )}

        <div className="mt-4 flex w-full justify-end">
          {filterOptions.length > 0 ? (
            <Select value={selectedOption} onValueChange={onOptionChange}>
              <SelectTrigger className="h-[44px] w-full max-w-[180px] rounded-[8px] border border-[#9E9E9E] bg-[#F9F9F9] px-3 text-[18px] leading-none font-medium text-[#222]">
                <SelectValue placeholder={`${category} 선택`} />
              </SelectTrigger>
              <SelectContent className="w-[180px] min-w-[180px] rounded-[8px] border border-[#9E9E9E] bg-[#F9F9F9] p-0">
                <SelectItem value="all" className="text-[18px]">
                  {category === '색상' ? '색상 옵션' : `전체 ${category}`}
                </SelectItem>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-[18px]">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[340px] items-center justify-center text-base text-gray-500">
          통계를 불러오는 중...
        </div>
      ) : isEmpty && isFiltered ? (
        <div className="flex h-[340px] w-full items-center justify-center px-8 text-center">
          <p className="text-[30px] leading-snug font-medium text-[#333]">
            {getEmptyMessage(emptyMessageVariant, selectedOption)}
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {limitedDetails.map((detail, index) => (
            <div
              key={`${category}-${getStatLabel(detail)}-${index}`}
              className="flex h-[66px] w-full items-center justify-between rounded-[10px] border border-[#B7ADAD] bg-[#F4F4F4] px-4"
            >
              <span className="text-[27px] leading-none font-medium text-[#222]">
                {getStatLabel(detail)}
              </span>
              <span className="text-[30px] leading-none font-medium text-[#222]">
                {detail.count}명
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
