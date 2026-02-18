'use client';

import { useState } from 'react';
import type { Category, CategorySimple } from '@/types/domain/category';
import MainNavBar from '@/components/layout/main-nav-bar';
import CategoryMainHeader from './category-main-header';
import CategoryMainRecommend from './category-main-recommend';
import CategoryMainParentList from './category-main-parent-list';
import useHideOnScroll from './use-hide-on-scroll';

interface CategoryMainLayoutProps {
  categories: Category[];
  recommended: CategorySimple[];
  parentLookup: Record<number, number>;
  userName: string;
}

export default function CategoryMainLayout({
  categories,
  recommended,
  parentLookup,
  userName,
}: CategoryMainLayoutProps) {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null,
  );

  const isRecommendVisible = useHideOnScroll({
    topOffset: 24,
    hideDelta: 12,
    showDelta: 28,
    freezeAfterToggleMs: 340,
    scrollTarget: scrollContainer,
  });

  return (
    <>
      <main className="flex h-[100dvh] flex-col bg-white">
        <CategoryMainHeader />
        <div
          ref={setScrollContainer}
          className="min-h-0 flex-1 overflow-y-scroll pb-72"
        >
          <CategoryMainRecommend
            items={recommended}
            parentLookup={parentLookup}
            isVisible={isRecommendVisible}
            userName={userName}
          />

          <CategoryMainParentList categories={categories} />
        </div>
      </main>

      <div className="fixed right-0 bottom-0 left-0">
        <MainNavBar />
      </div>
    </>
  );
}
