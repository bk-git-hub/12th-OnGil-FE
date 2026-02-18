'use client';

import SearchBar from '@/components/search-bar/search-bar';

export default function CategoryMainHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="px-4 py-8">
        <h1 className="mb-10 text-center text-3xl font-bold text-black">
          카테고리
        </h1>
        <SearchBar />
      </div>
    </header>
  );
}
