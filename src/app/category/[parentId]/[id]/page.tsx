import ProductListContainer from '@/components/product/product-list-container';
import { ProductFilterBar } from '@/components/product/product-filter-bar';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{ sortType?: string; page?: string }>;
}

export default function ProductListPage({ params, searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <Suspense
        fallback={
          <div className="mb-4 flex items-center justify-end">
            <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>
        }
      >
        <ProductFilterBar />
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
