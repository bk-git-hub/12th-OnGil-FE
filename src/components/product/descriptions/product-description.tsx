'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/domain/product';
import { Button } from '@/components/ui/button';
import { ProductNotice } from './product-notice';
import { RecommendedProductsCarousel } from './recommended-products-carousel';
import { ChevronDown, ChevronUp } from 'lucide-react';

// 상품 설명 섹션 컴포넌트, 상세 이미지, 펼치기

export function ProductDescription({
  product,
  similarProducts,
}: {
  product: Omit<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'> &
    Partial<Pick<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'>>;
  similarProducts: Product[];
}) {
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
            {src && (
              <Image
                src={src}
                alt={`상세 설명 이미지 ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
        ))}
      </div>

      {/* 8.4.1.1 펼치기 버튼 */}

      <Button
        variant="outline"
        className="bg-ongil-teal mt-6 w-full rounded-xl border-gray-300 py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '접기' : '자세히 보기'}
        {isExpanded ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </Button>

      {/* 하단 공통 영역 */}
      <div className="space-y-12 border-gray-100">
        <ProductNotice />
        <RecommendedProductsCarousel similarProducts={similarProducts} />
      </div>
    </div>
  );
}
