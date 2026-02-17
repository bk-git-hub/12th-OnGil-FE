import { ProductWithWishlist } from '@/types/domain/product';
import ProductCard from './product-card';

interface ProductListProps {
  products: ProductWithWishlist[];
  title?: string;
  totalElements?: number;
  productDetailFrom?: string;
  showWishlistButton?: boolean;
}

export function ProductList({
  products,
  totalElements,
  productDetailFrom,
  showWishlistButton = false,
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
                showWishlistButton={showWishlistButton}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
