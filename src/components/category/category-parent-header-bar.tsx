'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/search-bar/search-bar';

export default function CategoryParentHeaderBar() {
  return (
    <header className="sticky top-0 z-[60] border-b border-gray-200 bg-white">
      <div className="px-4 pt-6 pb-4">
        <div className="relative mb-4 flex items-center justify-center">
          <Link
            href="/category"
            className="absolute left-0 -ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="카테고리 목록으로 돌아가기"
          >
            <Image src="/icons/arrow.svg" width={24} height={24} alt="" />
          </Link>
          <h1 className="text-center text-3xl font-bold text-black">
            카테고리
          </h1>
        </div>
        <div className="min-w-0">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
