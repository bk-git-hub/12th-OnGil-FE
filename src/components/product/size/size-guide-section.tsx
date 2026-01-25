'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserBodyInfo, SizeAnalysisResult } from '@/mocks/size';
import { SimilarUserTable } from './similar-user-table';
import { MySize } from './my-size';

interface SizeGuideSectionProps {
  productType: 'top' | 'bottom' | 'shoes';
  userInfo: UserBodyInfo | null;
  analysisData: SizeAnalysisResult | null;
}

// 사이즈 가이드 섹션 컴포넌트(사이즈 선택 가이드 그래프, 자세히 보기 눌렀을 때 나오는 표와 내 사이즈 정보)

export function SizeGuideSection({
  productType,
  userInfo,
  analysisData,
}: SizeGuideSectionProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // userInfo = null; // 테스트용: 유저 정보 없는 상태

  // 유저 정보가 없는 경우
  if (!userInfo) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <div className="mx-auto flex max-w-xs flex-col items-center gap-4 px-4 font-bold">
          <h3 className="pb-6 text-xl text-gray-900">사이즈 선택 가이드</h3>
          <p className="mb-4 font-medium text-gray-500">정보가 없습니다.</p>
          <Button
            variant="outline"
            className="bg-ongil-teal w-full rounded-xl border-gray-300 py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
            onClick={() => alert('내 정보 수정 페이지로 이동')}
          >
            내 신체 정보 입력
          </Button>
        </div>
      </div>
    );
  }

  // 분석 데이터가 없는 경우
  if (!analysisData) {
    return null;
  }

  const { recommendedSizes, stats } = analysisData;

  return (
    <div className="flex flex-col gap-16">
      {/* 1. 사이즈 선택 가이드 (그래프)*/}
      <section className="space-y-10">
        <div className="flex flex-col items-center justify-between font-bold">
          <h3 className="pb-6 text-lg text-gray-900">사이즈 선택 가이드</h3>
          <div className="text-xl">
            추천 사이즈:{' '}
            <span className="text-ongil-teal font-bold">
              {recommendedSizes.join(', ')}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {stats.map((stat) => {
            const isRecommended = recommendedSizes.includes(stat.size);
            return (
              <div key={stat.size} className="flex items-center gap-3 text-sm">
                <div
                  className={`w-8 font-bold ${isRecommended ? 'text-ongil-teal' : 'text-gray-700'}`}
                >
                  {stat.size}
                </div>
                <div className="flex-1">
                  <Progress value={stat.ratio} className="h-2.5 bg-gray-100" />
                </div>
                <div className="w-12 text-right text-sm text-gray-500">
                  {stat.count}명
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 2. 자세히 보기 (표 + 내정보 영역) */}

      <section>
        <Button
          variant="outline"
          className="bg-ongil-teal mt-6 w-full rounded-xl border-gray-300 py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          aria-expanded={isDetailOpen}
        >
          {isDetailOpen ? '접기' : '자세히 보기'}
          {isDetailOpen ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>

        {isDetailOpen && (
          <div className="mt-4">
            <SimilarUserTable
              similarUsersSample={analysisData.similarUsersSample}
            />

            <hr className="mt-4 border-gray-100" />

            <MySize userInfo={userInfo} productType={productType} />
          </div>
        )}
      </section>
    </div>
  );
}
