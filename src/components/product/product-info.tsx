'use client';

import { type Ref } from 'react';
import { Product } from '@/mocks/product-data';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  discountRef?: Ref<HTMLButtonElement | null>;
}

export function ProductInfo({ product, discountRef }: ProductInfoProps) {
  const hasDiscount = !!product.discountRate;
  return (
    <div className="font-pretendard px-4 py-6">
      {/* 8.1.1 (1) 브랜드 */}
      <div className="mb-1 text-xl font-bold text-gray-500">
        {product.brand}
      </div>
      {/* 8.1.1 (3) 상품명 */}
      <h1 className="line-clamp-2 text-2xl leading-tight font-bold break-keep text-gray-900">
        {product.name}
      </h1>
      {/* 가격 정보 */}
      <div className="mt-4">
        {hasDiscount ? (
          <div className="flex flex-col">
            <div className="flex items-end gap-2">
              {/* 할인가 (현재 판매가) */}
              <span className="text-4xl font-bold text-black">
                <span className="sr-only">할인 판매가</span>
                {product.price.toLocaleString()}
                <span className="text-2xl font-normal">원</span>
              </span>

              {/* 할인율 */}
              <span className="mb-1 text-xl font-bold text-red-600">
                <span className="sr-only">할인율</span>
                {product.discountRate}%
              </span>
            </div>

            {/* 원가 (취소선)*/}
            <del className="mt-1 text-xl text-gray-400">
              <span className="sr-only">정상가</span>
              {product.originalPrice?.toLocaleString()}원
            </del>
          </div>
        ) : (
          <span className="text-2xl font-bold text-black">
            <span className="sr-only">판매가</span>
            {product.price.toLocaleString()}원
          </span>
        )}
      </div>
      {/* 리뷰 별점 정보 추가해야함. */}
      <h1 className="mt-3 text-gray-600">리뷰 별점 ★★★★☆</h1>

      {/* 8.2 할인 알림 받기 버튼, 추후 알림 로직 구현 해야함. */}
      <Button
        ref={discountRef}
        variant="outline"
        className="mt-6 w-full rounded-xl border-gray-300 bg-[#00363D] py-7 text-base font-bold text-white hover:bg-[#00252a] hover:text-white"
        onClick={() => alert('할인가 알림 신청 완료!')}
      >
        <Bell className="mr-2 h-5 w-5" />
        할인 알림 받기
      </Button>
    </div>
  );
}
