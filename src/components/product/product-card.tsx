import Link from 'next/link';
import Image from 'next/image';
import { ProductWithWishlist } from '@/types/domain/product';
import { WishlistButton } from './wishlist-button';

// 카드 UI 컴포넌트, 클릭 시 상세 페이지로 이동함.
interface ProductCardProps {
  product: ProductWithWishlist;
  detailFrom?: string;
  showWishlistButton?: boolean;
}

export default function ProductCard({
  product,
  detailFrom,
  showWishlistButton = false,
}: ProductCardProps) {
  const href = detailFrom
    ? `/product/${product.id}?from=${encodeURIComponent(detailFrom)}`
    : `/product/${product.id}`;
  const reviewRating = Number(product.reviewRating);
  const reviewCount = Number(product.reviewCount);
  const rating = Number.isFinite(reviewRating)
    ? reviewRating.toFixed(1)
    : '0.0';
  const count = Number.isFinite(reviewCount) ? reviewCount : 0;

  return (
    <Link href={href} className="block h-full">
      <article className="font-pretendard flex h-full w-full flex-col gap-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image
            src={product.thumbnailImageUrl}
            alt={product.name}
            width={320}
            height={426}
            className="h-full w-full object-cover"
          />
          {showWishlistButton && (
            <WishlistButton
              productId={product.id}
              initialIsLiked={product.isLiked || false}
              initialWishlistId={product.wishlistId}
              className="absolute top-2 right-2"
            />
          )}
        </div>
        <span className="line-clamp-1 text-xl font-extrabold">
          {product.brandName}
        </span>
        <span className="line-clamp-2 min-h-10 text-base font-medium">
          {product.name}
        </span>
        <div className="mt-0.5 flex w-full items-center gap-1.5 text-lg font-bold">
          {product.discountRate !== undefined && product.discountRate > 0 && (
            <span className="text-ongil-teal">{product.discountRate}%</span>
          )}
          <span>{product.finalPrice.toLocaleString()}원</span>
        </div>

        <div className="font-poppins flex items-center gap-1 text-sm font-semibold text-gray-500">
          <img src="/icons/star.svg" width={18} height={18} alt="평점" />
          <span>{rating}</span>
          <span>({count.toLocaleString()})</span>
        </div>
      </article>
    </Link>
  );
}
