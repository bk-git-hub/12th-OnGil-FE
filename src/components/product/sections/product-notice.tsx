'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// 추후 펼치기 컴퍼넌트로 분리 가능.
function NoticeItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:bg-gray-50"
      >
        <span className="text-sm font-bold text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden text-xs text-gray-500 transition-all duration-200',
          isOpen ? 'max-h-125 pb-5 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ProductNotice() {
  return (
    <div className="mt-10 border-t border-gray-200">
      {/* 1. 상품정보 제공 고시 */}
      <NoticeItem title="상품정보 제공 고시">
        <div className="space-y-1.5 leading-relaxed">
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">제품 소재</span>
            <span>상세페이지 참조</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">색상</span>
            <span>상세페이지 참조</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">치수</span>
            <span>상세페이지 참조</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">제조자</span>
            <span>(주)온길 / 해당사항 없음</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">제조국</span>
            <span>대한민국</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">세탁방법</span>
            <span>상세페이지 참조</span>
          </div>
          <div className="flex">
            <span className="w-24 shrink-0 text-gray-400">A/S 책임자</span>
            <span>온길 고객센터 (1544-0000)</span>
          </div>
        </div>
      </NoticeItem>

      {/* 2. 배송/교환/반품 안내 */}
      <NoticeItem title="교환/환불 방법">
        <div className="space-y-3 leading-relaxed">
          <div>
            <p className="font-bold text-gray-700">[배송 정보]</p>
            <p>배송 방법: 택배 배송</p>
            <p>배송 지역: 전국 지역</p>
            <p>배송 비용: 3,000원 (50,000원 이상 무료배송)</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">[교환/반품 안내]</p>
            <p>신청 기간: 상품 수령 후 7일 이내</p>
            <p>반품 비용: 왕복 배송비 6,000원 (고객 부담)</p>
          </div>
          <div>
            <p className="font-bold text-gray-700">[유의사항]</p>
            <p>단순 변심으로 인한 교환/반품은 7일 이내 가능합니다.</p>
            <p>상품 가치가 훼손된 경우 교환/반품이 불가합니다.</p>
          </div>
        </div>
      </NoticeItem>
    </div>
  );
}
