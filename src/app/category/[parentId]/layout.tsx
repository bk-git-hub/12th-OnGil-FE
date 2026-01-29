// app/category/[parentId]/layout.tsx

import SubCategorySliderContainer from '@/components/sub-category-slider/sub-category-slider-container';
import { Suspense } from 'react';

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ parentId: string }>;
}) {
  return (
    <section>
      <Suspense>
        <SubCategorySliderContainer params={params} />
      </Suspense>

      <main>{children}</main>
    </section>
  );
}
