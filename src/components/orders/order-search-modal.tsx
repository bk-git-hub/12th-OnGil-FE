'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  type PeriodPreset,
  getDefaultDateRange,
} from '@/lib/date-utils';

export { getDefaultDateRange };

export interface OrderSearchParams {
  keyword: string;
  startDate: string;
  endDate: string;
}

interface OrderSearchModalProps {
  defaultValues: OrderSearchParams;
  onSearch: (params: OrderSearchParams) => void;
  onClose: () => void;
}

export function OrderSearchModal({
  defaultValues,
  onSearch,
  onClose,
}: OrderSearchModalProps) {
  const [keyword, setKeyword] = useState(defaultValues.keyword);
  const [selectedPreset, setSelectedPreset] = useState<PeriodPreset>('1m');
  const [startDate, setStartDate] = useState(defaultValues.startDate);
  const [endDate, setEndDate] = useState(defaultValues.endDate);

  const handlePresetClick = (preset: PeriodPreset) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      const range = getDefaultDateRange(preset);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };

  const handleSearch = () => {
    onSearch({ keyword, startDate, endDate });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-24 items-center justify-between border-b border-gray-500 px-6">
        <button
          onClick={onClose}
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Image src="/icons/arrow.svg" width={37} height={37} alt="뒤로가기" />
        </button>
        <h2 className="text-3xl font-semibold">조회 조건 설정</h2>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* 검색바 */}
        <div className="bg-secondary-gray mb-8 flex h-12 w-full items-center justify-between rounded-md border border-[#5E5D5D] px-5 py-2">
          <input
            placeholder="상품명으로 검색"
            className="flex-1 bg-transparent text-xl leading-normal font-normal outline-none placeholder:text-gray-400"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            autoFocus
          />
          <Image
            src="/icons/search.svg"
            alt="검색 아이콘"
            width={26}
            height={26}
          />
        </div>

        {/* 조회 기간 설정 섹션 */}
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold">조회 기간</h3>

          {/* 기간 프리셋 버튼 */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '1개월', val: '1m' },
              { label: '6개월', val: '6m' },
              { label: '1년', val: '1y' },
              { label: '직접입력', val: 'custom' },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => handlePresetClick(btn.val as PeriodPreset)}
                className={`rounded-xl border-2 py-3 text-lg font-medium transition-colors ${
                  selectedPreset === btn.val
                    ? 'border-ongil-teal bg-white text-black'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* 날짜 선택 */}
          <div className="flex items-center gap-1 rounded-xl border-2 border-gray-300 p-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-3 py-2 text-lg">
                  {startDate
                    ? format(new Date(startDate), 'yyyy.MM.dd', { locale: ko })
                    : '시작일'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  locale={ko}
                  className="[--cell-size:3rem] p-4"
                  classNames={{
                    caption_label: 'text-lg font-semibold',
                    weekday:
                      'size-(--cell-size) text-center text-base text-gray-500 font-normal',
                    day: 'text-base',
                  }}
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(format(date, 'yyyy-MM-dd'));
                      setSelectedPreset('custom');
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            <span className="text-lg text-gray-500">~</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-3 py-2 text-lg">
                  {endDate
                    ? format(new Date(endDate), 'yyyy.MM.dd', { locale: ko })
                    : '종료일'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  locale={ko}
                  className="[--cell-size:3rem] p-4"
                  classNames={{
                    caption_label: 'text-lg font-semibold',
                    weekday:
                      'size-(--cell-size) text-center text-base text-gray-500 font-normal',
                    day: 'text-base',
                  }}
                  selected={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setEndDate(format(date, 'yyyy-MM-dd'));
                      setSelectedPreset('custom');
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* 하단 조회 버튼 */}
      <div className="px-5 pb-8">
        <button
          className="bg-ongil-teal w-full rounded-xl py-4 text-2xl text-white"
          onClick={handleSearch}
        >
          조회하기
        </button>
      </div>
    </div>
  );
}
