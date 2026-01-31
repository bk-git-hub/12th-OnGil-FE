'use client';

import { cn } from '@/lib/utils';
import { useProductInteraction } from '@/components/product';
import { PRODUCT_TABS } from '@/config/product-tabs';

// 상품 상세 정보 탭 컴포넌트

interface ProductTabProps {
  activateTab: string;
  onTabChange: (tabId: string) => void;
  reviewCount?: number;
}

/**
 * 상품 상세 정보 탭 컴포넌트
 * @param {ProductTabProps} props - 컴포넌트 props
 * @param {string} props.activateTab - 활성화된 탭 ID
 * @param {(tabId: string) => void} props.onTabChange - 탭 변경 콜백
 * @param {number} [props.reviewCount=0] - 리뷰 개수
 * @returns {JSX.Element} 상품 탭 컴포넌트
 */
export default function ProductTab({
  activateTab,
  onTabChange,
  reviewCount = 0,
}: ProductTabProps) {
  const { triggerScroll } = useProductInteraction();
  const handleTabClick = (tabId: string) => {
    triggerScroll();
    onTabChange(tabId);
  };

  const formatCount = (count: number) => {
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <div className="font-pretendard flex-start border-light-tertiary flex h-[98px] w-full rounded-xl bg-[#0000000A] p-[2px]">
      {PRODUCT_TABS.map((tab) => {
        let label: string = tab.label;
        if (tab.id === 'review') {
          label = `${tab.label} ${formatCount(reviewCount)}`;
        }
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'relative flex-1 border-r text-center text-2xl leading-8 font-medium -tracking-[0.08px] not-italic transition-colors last:border-0',
              // 선택됨: 흰색 배경으로 아래 콘텐츠와 자연스럽게 연결
              // 선택안됨: 회색 배경
              activateTab === tab.id ? 'rounded-2xl bg-white' : '',
            )}
          >
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
