import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/mocks/product-data';

interface ProductDetailProps {
  product: Product | null;
}

export function ProductDetail({ product }: ProductDetailProps) {
  if (!product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">상품 정보를 찾을 수 없습니다.</p>
        <Link
          href="/category"
          className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-screen-xl bg-white px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-between py-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500">
                {product.brand}
              </h2>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>
            <div className="border-t border-b py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  {product.price.toLocaleString()}원
                </span>
                {product.discountRate && (
                  <span className="text-xl font-bold text-red-600">
                    {product.discountRate}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-3">
            <button className="flex-1 rounded-lg border border-gray-300 py-4 font-bold hover:bg-gray-50">
              장바구니
            </button>
            <button className="flex-1 rounded-lg bg-black py-4 font-bold text-white hover:bg-gray-800">
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
