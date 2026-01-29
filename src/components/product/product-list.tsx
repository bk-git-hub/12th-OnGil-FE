import { Product } from '@/mocks/product-data';
import { ProductGrid } from './product-grid';

// categoryId를 받아 해당 카테고리의 이름과 상품 데이터를 필터링하여, 상단 헤더와 상품 그리드 형태로 보여주는 목록 페이지 컴포넌트

interface ProductListProps {
  products: Product[];
  title: string;
}

export function ProductList({ products, title }: ProductListProps) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white">
      <main className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            총 <b className="text-black">{products.length}</b>개
          </span>
        </div>

        <ProductGrid
          products={products}
          emptyMessage="해당 카테고리에 등록된 상품이 없습니다."
        />
      </main>
    </div>
  );
}
