'use client';

import { useEffect, useRef } from 'react';
import { CATEGORIES } from '@/mocks/category-data';
import { useScrollSpy } from './use-scroll-spy';
import { CategoryTab } from './category-tab';
import { CategoryContentList } from './category-content-list';
import SearchBar from '@/components/search-bar';

// 사용자의 스크롤 위치에 따라 사이드바의 활성 탭을 자동으로 변경하고(Scroll Spy), 탭을 클릭하면 해당 콘텐츠 위치로 이동.
export default function Category() {
  const categoryIds = CATEGORIES.map((c) => c.id);
  const { activeId, scrollToId, containerRef } = useScrollSpy(categoryIds);
  const sidebarRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!activeId || !sidebarRef.current) return;
    const activeTab = document.getElementById(`tab-${activeId}`);
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeId]);

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <header className="z-20 flex flex-shrink-0 items-center border-b bg-white px-4 py-3">
        <SearchBar />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="scrollbar-hide z-10 w-24 flex-shrink-0 overflow-y-auto bg-gray-50 pb-20">
          <ul ref={sidebarRef}>
            {CATEGORIES.map((category) => (
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
          <div className="px-4 pt-4">
            <CategoryContentList categories={CATEGORIES} />
          </div>
        </main>
      </div>
    </div>
  );
}
