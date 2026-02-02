// app/category/[parentId]/layout.tsx

import SubCategorySliderContainer from '@/components/sub-category-slider/sub-category-slider-container';
import { CategoryParentHeaderBar } from './_components/category-parent-header-bar';
import { Suspense } from 'react';

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ parentId: string }>;
}) {
  return (
    <section className="flex flex-col">
      <CategoryParentHeaderBar />

      <Suspense>
        <SubCategorySliderContainer params={params} />
      </Suspense>

      <main>{children}</main>
    </section>
  );
}
