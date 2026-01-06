'use client';

import { useEffect, useRef } from 'react';
import SearchBar from '@/components/search-bar';
import { useScrollSpy } from './use-scroll-spy';
import { CategoryTab } from './category-tab';

interface CategoryLayoutProps {
  children: React.ReactNode;
  categories: { id: string; name: string }[];
}

// 사용자의 스크롤 위치에 따라 사이드바의 활성 탭을 자동으로 변경하고(Scroll Spy), 탭을 클릭하면 해당 콘텐츠 위치로 이동.

export function CategoryLayout({ children, categories }: CategoryLayoutProps) {
  const categoryIds = categories.map((c) => c.id);

  const { activeId, scrollToId, containerRef } = useScrollSpy(categoryIds);
  const sidebarRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeId) return;

    document.getElementById(`tab-${activeId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeId]);

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <header className="z-20 flex flex-shrink-0 items-center border-b bg-white px-4 py-3">
        <SearchBar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="scrollbar-hide z-10 w-24 flex-shrink-0 overflow-y-auto bg-gray-50 pb-20">
          <ul ref={sidebarRef}>
            {categories.map((category) => (
              <li key={category.id} id={`tab-${category.id}`}>
                <CategoryTab
                  label={category.name}
                  isActive={activeId === category.id}
                  onClick={() => scrollToId(category.id)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <main
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-white pb-32"
        >
          <div className="px-4 pt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
