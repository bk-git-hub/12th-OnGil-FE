import ProductListContainer from '@/components/product/product-list-container';
import ProductFilterBarContainer from '@/components/product/product-filter-bar-container';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{
    sortType?: string;
    page?: string;
    clothingSizes?: string | string[];
    priceRange?: string | string[];
    brandIds?: string | string[];
  }>;
}

export default function ProductListPage({ params, searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <Suspense
        fallback={
          <div className="mb-4 flex items-center gap-2">
            <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-10 w-20 animate-pulse rounded-full bg-gray-200" />
          </div>
        }
      >
        <ProductFilterBarContainer params={params} searchParams={searchParams} />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        }
      >
        <ProductListContainer params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
