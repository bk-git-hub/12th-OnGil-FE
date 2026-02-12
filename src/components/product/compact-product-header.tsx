'use client';

import Image from 'next/image';
import { Product } from '@/types/domain/product';

interface CompactProductHeaderProps {
  product: Omit<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'> &
    Partial<Pick<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'>>;
}

/**
 * 상품 상세 페이지 스크롤 시 상단에 고정되는 요약 헤더 컴포넌트
 * @param {CompactProductHeaderProps} props - 컴포넌트 props
 * @param {Product} props.product - 상품 정보
 * @returns {JSX.Element} 컴팩트 상품 헤더 컴포넌트
 */
export default function CompactProductHeader({ product }: CompactProductHeaderProps) {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-white px-4">
      <div className="flex items-center gap-3 overflow-hidden pt-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-100">
          {product.thumbnailImageUrl && (
            <Image
              src={product.thumbnailImageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          )}
        </div>

        {/* 정보 (상품명, 가격) */}
        <div className="flex flex-col justify-center overflow-hidden">
          <span className="truncate text-sm font-medium text-gray-900">
            {product.name}
          </span>
          <div className="flex items-center gap-1 text-xs">
            {product.discountRate > 0 && (
              <span className="font-bold text-red-600">
                {product.discountRate}%
              </span>
            )}
            <span className="font-bold text-black">
              {product.finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
