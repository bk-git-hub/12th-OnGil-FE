'use client';

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
  const isRecommendVisible = useHideOnScroll({
    topOffset: 24,
    scrollDelta: 12,
  });

  return (
    <main className="min-h-screen bg-white pb-96">
      <CategoryMainHeader />

      <CategoryMainRecommend
        items={recommended}
        parentLookup={parentLookup}
        isVisible={isRecommendVisible}
        userName={userName}
      />

      <CategoryMainParentList categories={categories} />

      <div className="fixed bottom-0 w-full">
        <MainNavBar />
      </div>
    </main>
  );
}
