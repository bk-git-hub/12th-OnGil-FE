import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/domain/product';
import { StockStatus } from '@/types/enums';
import { cn } from '@/lib/utils';

// 카드 UI 컴포넌트, 클릭 시 상세 페이지로 이동함.

interface ProductWithStock extends Product {
  stockStatus?: StockStatus;
  originalPrice?: number;
}

interface ProductCardProps {
  product: ProductWithStock;
}

export function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.stockStatus === StockStatus.SOLD_OUT;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={product.thumbnailImageUrl}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-transform duration-300 group-hover:scale-105',
            isSoldOut && 'opacity-50 grayscale',
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
              SOLD OUT
            </span>
          </div>
        )}
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
          <span>{product.finalPrice.toLocaleString()}</span>
        </div>

        {product.price && (
          <p className="text-xs text-gray-400 line-through">
            {product.price.toLocaleString()}원
          </p>
        )}
      </div>
    </Link>
  );
}
