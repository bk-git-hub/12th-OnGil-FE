'use client';

import { cn } from '@/lib/utils';
import { useProductInteraction } from '@/components/product';
import { PRODUCT_TABS } from '@/config/product-tabs';
import { Button } from '../ui/button';

// 상품 상세 정보 탭 컴포넌트

interface ProductTabProps {
  activateTab: string;
  onTabChange: (tabId: string) => void;
}

export function ProductTab({ activateTab, onTabChange }: ProductTabProps) {
  const { triggerScroll } = useProductInteraction();
  const handleTabClick = (tabId: string) => {
    triggerScroll();
    onTabChange(tabId);
  };
  return (
    <div className="font-pretendard flex h-12 w-full bg-[#D9D9D9]">
      {PRODUCT_TABS.map((tab) => {
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'relative flex-1 py-3 text-center text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset',
              // 선택됨: 흰색 배경으로 아래 콘텐츠와 자연스럽게 연결
              // 선택안됨: 회색 배경
              activateTab === tab.id
                ? 'bg-white font-bold text-black'
                : 'font-medium text-[#8B8A8A] hover:text-gray-600',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
