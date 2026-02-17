import { ProductWithWishlist } from '@/types/domain/product';
import ProductCard from './product-card';

interface ProductListProps {
  products: ProductWithWishlist[];
  title?: string;
  totalElements?: number;
  productDetailFrom?: string;
  showWishlistButton?: boolean;
}

export default function ProductList({
  products,
  totalElements,
  productDetailFrom,
  showWishlistButton = false,
}: ProductListProps) {
  const count = totalElements ?? products.length;

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white pb-10">
      <main>
        <div className="mb-5 flex items-end justify-between">
          <span className="text-base font-medium text-gray-600">
            총 <b className="text-xl font-bold text-black">{count}</b>개
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex h-60 items-center justify-center rounded-xl border border-gray-100 text-gray-500">
            해당 카테고리에 등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
