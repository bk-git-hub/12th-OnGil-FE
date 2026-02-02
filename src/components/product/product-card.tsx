import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/domain/product';

// 카드 UI 컴포넌트, 클릭 시 상세 페이지로 이동함.
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.thumbnailImageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs font-bold text-gray-900">{product.brandName}</p>
        <h3 className="line-clamp-2 text-sm text-gray-700">{product.name}</h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            {product.finalPrice.toLocaleString()}원
          </span>
          {product.discountRate > 0 && (
            <span className="text-sm font-bold text-red-600">
              {product.discountRate}%
            </span>
          )}
        </div>

        {product.discountRate > 0 && (
          <p className="text-xs text-gray-400 line-through">
            {product.price.toLocaleString()}원
          </p>
        )}
      </div>
    </Link>
  );
}
