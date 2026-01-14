'use client';

import Image from 'next/image';
import { Product } from '@/mocks/product-data';

interface CompactProductHeaderProps {
  product: Product;
}

// 상품 상세 페이지를 스크롤 하였을 때 상단에 작게 상품 정보를 요약하여 보여주는 컴포넌트
// 탭바와 같이 상단에 고정된다.

export function CompactProductHeader({ product }: CompactProductHeaderProps) {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-white px-4">
      <div className="flex items-center gap-3 overflow-hidden pt-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        {/* 정보 (상품명, 가격) */}
        <div className="flex flex-col justify-center overflow-hidden">
          <span className="truncate text-sm font-medium text-gray-900">
            {product.name}
          </span>
          <div className="flex items-center gap-1 text-xs">
            {product.discountRate && (
              <span className="font-bold text-red-600">
                {product.discountRate}%
              </span>
            )}
            <span className="font-bold text-black">
              {product.price.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
