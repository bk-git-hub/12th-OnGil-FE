'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/mocks/product-data';
import { ProductImageSlider } from './product-image-slider';
import { ProductInfo } from './product-info';
import { ProductTab } from './product-tab';
import { ProductBottomBar } from './product-bottom-bar';
import { ProductDescription } from './sections/product-description';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { cn } from '@/lib/utils';
import { CompactProductHeader } from './compact-product-header';

interface ProductDetailProps {
  product: Product;
}

type TabType = 'desc' | 'size' | 'inquiry' | 'review';

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('desc');
  const [isTabSticky, setIsTabSticky] = useState(false);

  // 위치 감지 및 스크롤 타겟용 Ref
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 탭 변경 핸들러 (자동 스크롤 기능 포함)
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    if (sentinelRef.current) {
      // 탭바 시작 위치(Sentinel)의 절대 좌표 계산
      const elementRect = sentinelRef.current.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;

      // 해당 위치로 스크롤 이동
      window.scrollTo({
        top: absoluteElementTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 스크롤 내리면 Sticky 활성화
        setIsTabSticky(
          !entry.isIntersecting && entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-white pb-32">
      <ProductImageSlider imageUrl={product.imageUrl} />
      <ProductInfo product={product} />

      {/* 감지용 Sentinel: 탭바 바로 위에 위치 */}
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute h-0 w-full"
      />

      {/* Sticky 컨테이너: [요약 헤더] + [탭바] */}
      <div
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-all duration-300',
          isTabSticky ? 'shadow-md' : 'shadow-none',
        )}
      >
        {/* 요약 정보 헤더 */}
        <div
          className={cn(
            'overflow-hidden border-b border-gray-100 bg-white transition-[height,opacity] duration-300 ease-in-out',
            isTabSticky ? 'h-16 opacity-100' : 'h-0 opacity-0',
          )}
        >
          <CompactProductHeader product={product} />
        </div>

        {/* 탭바 */}
        <ProductTab activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* 탭 컨텐츠 영역 */}
      <div className="min-h-screen px-4 py-8">
        {activeTab === 'desc' && <ProductDescription product={product} />}
        {activeTab === 'size' && (
          <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
            <p>사이즈 가이드 영역 (준비중)</p>
          </div>
        )}
        {activeTab === 'inquiry' && (
          <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
            <p>문의 영역 (준비중)</p>
          </div>
        )}
        {activeTab === 'review' && (
          <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
            <p>소재/리뷰 영역 (준비중)</p>
          </div>
        )}
      </div>

      <ScrollToTop isVisible={isTabSticky} />
      <ProductBottomBar />
    </div>
  );
}
