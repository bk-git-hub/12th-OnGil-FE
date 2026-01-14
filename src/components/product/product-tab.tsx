'use client';

import { cn } from '@/lib/utils';

type TabType = 'desc' | 'size' | 'inquiry' | 'review';

interface ProductTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// 상품 상세 정보 탭 컴포넌트

export function ProductTab({ activeTab, onTabChange }: ProductTabProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'desc', label: '상품 설명' },
    { id: 'size', label: '사이즈' },
    { id: 'inquiry', label: '문의' },
    { id: 'review', label: '소재/리뷰' },
  ];

  return (
    <div
      className="font-pretendard flex h-12 w-full bg-[#D9D9D9]"
      role="tablist"
      aria-label="상품 상세 정보 탭"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={isActive} // 선택된 상태 알림
            className={cn(
              'relative flex-1 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset',
              // 선택됨: 흰색 배경으로 아래 콘텐츠와 자연스럽게 연결
              // 선택안됨: 회색 배경
              isActive
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
