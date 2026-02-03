'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { ReviewCategorySummary } from '@/types/domain/review';

// 리뷰 통계의 특정 카테고리(사이즈, 색감, 소재 등) 분석 컨텐츠 컴포넌트

interface AnalysisContentProps {
  category: string;
  stat: ReviewCategorySummary;
  filterOptions?: string[];
}

/**
 * 리뷰 통계의 특정 카테고리(사이즈, 색감, 소재 등) 분석 컨텐츠 컴포넌트
 * @param {AnalysisContentProps} props - 컴포넌트 props
 * @param {string} props.category - 카테고리 이름
 * @param {ReviewCategorySummary} props.stat - 통계 데이터
 * @param {string[]} [props.filterOptions] - 필터 옵션 목록
 * @returns {JSX.Element} 분석 컨텐츠 컴포넌트
 */
export default function AnalysisContent({
  category,
  stat,
  filterOptions = [],
}: AnalysisContentProps) {
  const [selectedOption, setSelectedOption] = useState<string>('all');

  const { details: displayDetails, totalCount } = useMemo(() => {
    let details = stat.answerStats.map((item) => ({ ...item, percentage: 0 }));

    if (selectedOption !== 'all') {
      // NOTE: 목업용 랜덤 처리 (실제 데이터 적용 시 제거)
      if (category === '색감' && selectedOption === 'Mint') {
        details = details.map((d) => ({ ...d, count: 0 }));
      } else {
        details = details.map((d) => ({
          ...d,
          count: Math.floor(d.count * (0.3 + Math.random() * 0.4)),
        }));
      }
    }

    const total = details.reduce((acc, curr) => acc + curr.count, 0);

    details = details.map((d) => ({
      ...d,
      percentage: total === 0 ? 0 : Math.round((d.count / total) * 100),
    }));

    if (selectedOption === 'all') {
      details.sort((a, b) => b.count - a.count);
    }

    return { details, totalCount: total };
  }, [stat.answerStats, selectedOption, category]);

  return (
    <div className="flex w-full flex-col px-5">
      {/* 1. 타이틀 & 필터 영역 */}
      <div className="mb-4 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-900">{category}</h3>

        {/* 필터 Select */}
        <div className="mt-4 flex w-full justify-end">
          {filterOptions.length > 0 ? (
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger className="max-h-[45px] w-[140px] border-gray-200 bg-gray-50 font-medium">
                <SelectValue placeholder={`${category} 선택`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 {category}</SelectItem>
                {filterOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
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

      {/* 2. 컨텐츠 영역 (조건부 렌더링) */}

      {totalCount === 0 && selectedOption !== 'all' ? (
        <div className="flex h-[200px] w-full flex-col items-center justify-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">
            아직 이 {category === '색감' ? '색상을' : '옵션을'} 고른 분들의
            <br />
            후기가 없어요
          </p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3">
          {displayDetails.map((detail, index) => (
            <div
              key={`${category}-${detail.label ?? index}`}
              className="flex h-[60px] w-full items-center justify-between rounded-[10px] border border-[#B7ADAD] bg-[#F4F4F4] px-[15px]"
            >
              <span
                className={cn(
                  'font-medium transition-colors duration-300',
                  detail.count > 0 ? 'text-gray-900' : 'text-gray-500',
                )}
              >
                {detail.label}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {detail.count}명
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
