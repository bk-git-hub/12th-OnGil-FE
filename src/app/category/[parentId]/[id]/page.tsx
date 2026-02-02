import ProductListContainer from '@/components/product/product-list-container';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ parentId: string; id: string }>;
}

export default function ProductListPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <ProductListContainer params={params} />
    </Suspense>
  );
}
