import { Product } from '@/types/domain/product';
import ProductCard from './product-card';

// 상품 목록 데이터를 받아서 그리드 형태로 보여주는 목록 페이지 컴포넌트

interface ProductListProps {
  products: Product[];
  title?: string;
  totalElements?: number;
  productDetailFrom?: string;
}

export function ProductList({
  products,
  totalElements,
  productDetailFrom,
}: ProductListProps) {
  const count = totalElements ?? products.length;

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white">
      <main className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            총 <b className="text-black">{count}</b>개
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex h-60 items-center justify-center text-gray-500">
            해당 카테고리에 등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                detailFrom={productDetailFrom}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
