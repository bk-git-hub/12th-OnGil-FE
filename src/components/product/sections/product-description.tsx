'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product, PRODUCTS } from '@/mocks/product-data';
import { RecommendedProductsCarousel } from '@/components/product/recommended-products-carousel';
import { Button } from '@/components/ui/button';
import { ProductNotice } from './product-notice';

// 상품 설명 섹션 컴포넌트, 상세 이미지, 펼치기, 추천 상품을 포함

export function ProductDescription({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 8.4.1 (4) 펼치면 상세 이미지 10개
  const detailImages = Array(10).fill(product.imageUrl);

  // 8.4.1 (3) 펼치기 전에는 3개만
  const visibleImages = isExpanded ? detailImages : detailImages.slice(0, 3);

  // 8.4.2 추천 상품 (카테고리가 같은 상품 6개만)
  const recommendedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    6,
  );

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
              sizes="(max-width: 768px) 100vw, 40vw"
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
          펼치기
          <span className="text-xs">▼</span>
        </Button>
      )}
      <ProductNotice />

      {/* 8.4.2 비슷한 상품 추천 */}
      <div className="pt-4">
        <RecommendedProductsCarousel products={recommendedProducts} />
      </div>
    </div>
  );
}
