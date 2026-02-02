'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/search-bar/search-bar';

export default function CategoryParentHeaderBar() {
  return (
    <header className="sticky top-0 z-[60] flex h-[85px] shrink-0 items-center gap-3 border-b bg-white px-4 py-5">
      <Link
        href="/category"
        className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
        aria-label="카테고리 목록으로 돌아가기"
      >
        <Image src="/icons/arrow.svg" width={24} height={24} alt="" />
      </Link>
      <SearchBar />
    </header>
  );
}
