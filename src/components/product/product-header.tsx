'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface ProductHeaderProps {
  categoryID?: string;
}

// 상품 상세 페이지 헤더 컴포넌트.

export function ProductHeader({ categoryID }: ProductHeaderProps) {
  const params = useParams();
  // const id = params.id as string;

  const backLink = categoryID ? `/products/${categoryID}` : '/products/top-all';

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-gray-100 bg-white px-4">
      <Link
        href={backLink}
        className="flex h-10 w-10 items-center justify-start transition-opacity hover:opacity-70"
        aria-label="목록으로 돌아가기"
      >
        <Image src="/icons/arrow.svg" width={24} height={24} alt="뒤로가기" />
      </Link>

      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-black">
        상품 정보
      </span>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="검색 열기"
        >
          <Image src="/icons/search.svg" width={24} height={24} alt="검색" />
        </Link>

        <Link
          href="/cart-list"
          className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="장바구니 리스트"
        >
          <Image
            src="/icons/cart.svg"
            width={24}
            height={24}
            alt="장바구니 리스트"
          />
        </Link>
      </div>
    </header>
  );
}
