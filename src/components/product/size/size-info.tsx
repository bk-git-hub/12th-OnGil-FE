'use client';

import { Sparkles } from 'lucide-react';

// AI가 생성한 이미지를 보여주는 컴포넌트 => 추후 연동 필요.

export function SizeInfo() {
  return (
    <div className="space-y-4">
      <h3 className="px-4 text-lg font-bold text-gray-900">사이즈 정보</h3>
      <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <div className="rounded-full bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <Sparkles className="text-ongil-teal h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">AI 실측 사이즈 이미지</p>
            <p className="text-sm leading-relaxed text-gray-500">
              현재 상품의 실측 정보를 기반으로
              <br />
              AI가 생성한 이미지가 표시됩니다.
            </p>
          </div>
        </div>
      </div>
      <p className="text-right text-xs text-gray-400">
        * 측정 방법에 따라 1-3cm 오차가 있을 수 있습니다.
      </p>
    </div>
  );
}
