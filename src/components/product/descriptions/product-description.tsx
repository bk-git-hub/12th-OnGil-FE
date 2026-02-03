'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/domain/product';
import { Button } from '@/components/ui/button';
import { ProductNotice } from './product-notice';
import { RecommendedProductsCarousel } from './recommended-products-carousel';
import { PRODUCTS } from '@/mocks/product-data';

// 상품 설명 섹션 컴포넌트, 상세 이미지, 펼치기

export function ProductDescription({ product }: { product: Product }) {
  // 현재 상품 제외하고 6개 추천
  const recommendedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    6,
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // 8.4.1 (4) 펼치면 상세 이미지 10개
  const detailImages = Array(10).fill(product.thumbnailImageUrl);
  // 8.4.1 (3) 펼치기 전에는 3개만
  const visibleImages = isExpanded ? detailImages : detailImages.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* 상세 이미지 리스트 */}
      <div className="flex flex-col gap-3">
        {visibleImages.map((src, idx) => (
          <div key={idx} className="relative aspect-3/4 w-full">
            <Image
              src={src}
              alt={`상세 설명 이미지 ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {/* 8.4.1.1 펼치기 버튼 */}
      {!isExpanded && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center justify-center gap-2 rounded-none border-y border-gray-200 py-6 text-sm font-bold text-gray-600 hover:bg-gray-50"
        >
          펼치기 <span className="text-xs">▼</span>
        </Button>
      )}

      {/* 하단 공통 영역 */}
      <div className="space-y-12 border-t border-gray-100 pt-10">
        <ProductNotice />
        <div className="pt-4">
          <RecommendedProductsCarousel products={recommendedProducts} />
        </div>
      </div>
    </div>
  );
}
