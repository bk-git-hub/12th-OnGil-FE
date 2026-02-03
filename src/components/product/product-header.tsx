'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { CloseButton } from '../ui/close-button';

interface ProductHeaderProps {
  categoryID: string | number | undefined;
}

/**
 * 상품 상세 페이지 헤더 컴포넌트
 * @param {ProductHeaderProps} props - 컴포넌트 props
 * @param {string | number | undefined} props.categoryID - 카테고리 ID
 * @returns {JSX.Element} 상품 헤더 컴포넌트
 */
export default function ProductHeader({ categoryID }: ProductHeaderProps) {
  const backLink = categoryID ? `/products/${categoryID}` : '/products/top-all';

  return (
    <header className="sticky top-0 z-50 flex h-[90px] w-full items-center justify-between bg-white px-[18px]">
      <CloseButton />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-semibold">
        상품 정보
      </span>

      <div className="flex items-center gap-[15px]">
        <Link
          href="/search"
          className="flex items-center justify-center transition-opacity hover:opacity-70"
          aria-label="검색 열기"
        >
          <Image
            src="/icons/search-black.svg"
            width={30}
            height={30}
            alt="검색"
          />
        </Link>
        <Link
          href="/cart-list"
          className="flex flex-col items-center justify-center pt-3 transition-opacity hover:opacity-70"
          aria-label="장바구니 리스트"
        >
          <Image
            src="/icons/cart.svg"
            width={30}
            height={30}
            alt="장바구니 리스트"
          />
          <span className="text-right text-xs leading-normal font-semibold not-italic">
            장바구니
          </span>
        </Link>
      </div>
    </header>
  );
}
