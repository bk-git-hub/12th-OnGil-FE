'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/search-bar/search-bar';
import useScrollSpy from './use-scroll-spy';
import CategoryTab from './category-tab';
import { Category } from '@/types/domain/category';

interface CategoryLayoutProps {
  children: React.ReactNode;
  categories: Category[];
}

// 사용자의 스크롤 위치에 따라 사이드바의 활성 탭을 자동으로 변경하고(Scroll Spy), 탭을 클릭하면 해당 콘텐츠 위치로 이동.

export default function CategoryLayout({
  children,
  categories,
}: CategoryLayoutProps) {
  const categoryIds = categories.map((c) => c.categoryId.toString());

  const { activeId, scrollToId, containerRef } = useScrollSpy(categoryIds);
  const sidebarRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeId) return;

    document.getElementById(`tab-${activeId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [activeId]);

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <header className="z-20 flex shrink-0 items-center gap-3 border-b bg-white px-4 py-3">
        <Link
          href="/"
          className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="홈으로 돌아가기"
        >
          <Image src="/icons/arrow.svg" width={24} height={24} alt="" />
        </Link>
        <SearchBar />
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <nav className="scrollbar-hide z-10 flex h-full min-h-0 w-32 shrink-0 flex-col overflow-y-auto border-r border-gray-300 bg-gray-100 pb-20">
          <ul ref={sidebarRef} className="flex h-full min-h-0 flex-col">
            {categories.map((category) => (
              <li
                key={category.categoryId.toString()}
                id={`tab-${category.categoryId.toString()}`}
              >
                <CategoryTab
                  label={category.name}
                  isActive={activeId === category.categoryId.toString()}
                  onClick={() => scrollToId(category.categoryId.toString())}
                />
              </li>
            ))}
          </ul>
        </nav>

        <main
          ref={containerRef}
          className="min-h-0 flex-1 overflow-y-auto bg-white pb-32"
        >
          <div className="px-4 pt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
