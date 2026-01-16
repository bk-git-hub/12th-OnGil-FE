'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProductInteraction } from '@/components/product';
import { PRODUCT_TABS } from '@/config/product-tabs';

// 상품 상세 정보 탭 컴포넌트

interface ProductTabProps {
  productId: string;
}

export function ProductTab({ productId }: ProductTabProps) {
  const pathname = usePathname();
  const { triggerScroll } = useProductInteraction();

  return (
    <div className="font-pretendard flex h-12 w-full bg-[#D9D9D9]">
      {PRODUCT_TABS.map((tab) => {
        const href = `/product/${productId}/${tab.id}`;

        // /product/id일 경우 desc 탭 활성화.
        const isActive =
          pathname.endsWith(`/${tab.id}`) ||
          (tab.id === 'desc' && pathname === `/product/${productId}`);

        return (
          <Link
            key={tab.id}
            href={href}
            scroll={false} // 기본 스크롤 방지
            onClick={() => triggerScroll()}
            className={cn(
              'relative flex-1 py-3 text-center text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset',
              // 선택됨: 흰색 배경으로 아래 콘텐츠와 자연스럽게 연결
              // 선택안됨: 회색 배경
              isActive
                ? 'bg-white font-bold text-black'
                : 'font-medium text-[#8B8A8A] hover:text-gray-600',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
