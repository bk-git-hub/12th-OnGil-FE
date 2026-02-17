import SubCategorySliderContainer from '@/components/sub-category-slider/sub-category-slider-container';
import CategoryParentHeaderBar from '@/components/category/category-parent-header-bar';
import { Suspense } from 'react';

export default async function CategoryProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ parentId: string }>;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <CategoryParentHeaderBar />

      <Suspense fallback={<div className="h-12 animate-pulse bg-gray-100" />}>
        <SubCategorySliderContainer params={params} />
      </Suspense>

      <main className="min-h-0 flex-1">{children}</main>
    </section>
  );
}
