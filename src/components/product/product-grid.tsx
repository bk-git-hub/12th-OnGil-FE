import { Product } from '@/types/domain/product';
import { ProductCard } from './product-card';

// 상품 목록 데이터를 받아서 그리드 형식으로 렌더링하는 컴포넌트.

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = '등록된 상품이 없습니다.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-60 items-center justify-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
