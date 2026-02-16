'use client';

import { type Ref } from 'react';
import { Product } from '@/types/domain/product';
import { Button } from '@/components/ui/button';
import StarRating from '../ui/star-rating';

interface ProductInfoProps {
  product: Omit<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'> &
    Partial<Pick<Product, 'viewCount' | 'purchaseCount' | 'reviewCount'>>;
  discountRef?: Ref<HTMLButtonElement | null>;
}

/**
 * 상품 기본 정보(브랜드, 상품명, 가격, 할인 알림 버튼)를 표시하는 컴포넌트
 * @param {ProductInfoProps} props - 컴포넌트 props
 * @param {Product} props.product - 상품 정보
 * @param {Ref<HTMLButtonElement | null>} [props.discountRef] - 할인 알림 버튼에 대한 ref
 * @returns {JSX.Element} 상품 정보 컴포넌트
 */
export default function ProductInfo({
  product,
  discountRef,
}: ProductInfoProps) {
  const hasDiscount = !!product.discountRate;
  return (
    <div className="font-pretendard p-[22px] leading-[18px] not-italic">
      {/* 8.1.1 (1) 브랜드 */}
      <div className="mb-4 text-xl font-extrabold">{product.brandName}</div>
      {/* 8.1.1 (3) 상품명 */}
      <h1 className="mb-4 px-2 text-2xl leading-tight font-medium">
        {product.name}
      </h1>
      {hasDiscount ? (
        <div className="flex flex-col gap-4">
          <del className="text-xl text-[#0000004F]">
            <span className="sr-only">정상가</span>
            {product.price.toLocaleString()}원
          </del>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-red-600">
              <span className="sr-only">할인율</span>
              {product.discountRate}%
            </span>
            <span className="text-4xl font-bold">
              <span className="sr-only">할인 판매가</span>
              {product.finalPrice.toLocaleString()}원
            </span>
          </div>
        </div>
      ) : (
        <span className="text-4xl font-bold">
          <span className="sr-only">판매가</span>
          {product.price.toLocaleString()}원
        </span>
      )}
      <div className="mt-6 flex items-center gap-2">
        <StarRating rating={product.reviewRating} size={24} />
        <span className="font-Poppins text-sm leading-5 font-semibold not-italic">
          ({product.reviewCount ?? 0})
        </span>
      </div>
      {/* 8.2 할인 알림 받기 버튼, 추후 알림 로직 구현 해야함. */}
      <div className="flex justify-center">
        <Button
          ref={discountRef}
          variant="outline"
          className="bg-ongil-teal mt-6 h-[66px] w-[232px] justify-center rounded-3xl py-5 text-center text-xl leading-normal font-bold text-white"
          onClick={() => alert('할인가 알림 신청 완료!')}
        >
          할인 알림
        </Button>
      </div>
    </div>
  );
}
