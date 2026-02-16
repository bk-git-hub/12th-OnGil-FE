import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/domain/product';
import { WishlistButton } from '../product/wishlist-button';

interface RecommendedProduct extends Product {
  isLiked?: boolean;
}

export default function RecommendedProductCard({
  productInfo,
}: {
  productInfo: RecommendedProduct;
}) {
  const href = `/product/${productInfo.id}?from=${encodeURIComponent('/')}`;
  const hasDiscount = productInfo.discountRate && productInfo.discountRate > 0;
  const isAuction = productInfo.productType === 'SPECIAL_SALE';
  const rating = Number.isFinite(productInfo.reviewRating)
    ? productInfo.reviewRating.toFixed(1)
    : '-';

  let priceDisplay;
  if (hasDiscount) {
    if (isAuction) {
      // For AUCTION, show final and original price. Discount is on the image.
      priceDisplay = (
        <div className="flex items-baseline gap-2">
          <span className="text-ongil-teal text-xl font-bold">
            {productInfo.finalPrice.toLocaleString('ko-KR')}
          </span>
          {productInfo.price > 0 && (
            <span className="font-normal text-black/50 line-through">
              {productInfo.price.toLocaleString('ko-KR')}
            </span>
          )}
        </div>
      );
    } else {
      // For NORMAL with discount, show rate and final price.
      priceDisplay = (
        <div className="text-ongil-teal flex gap-2 text-xl font-bold">
          <span>{productInfo.discountRate}%</span>
          <span>{productInfo.finalPrice.toLocaleString('ko-KR')}</span>
        </div>
      );
    }
  } else {
    // For any product with no discount.
    priceDisplay = (
      <span className="text-ongil-teal text-xl font-bold">
        {productInfo.finalPrice.toLocaleString('ko-KR')}
      </span>
    );
  }

  return (
    <Link href={href} className="block">
      <div className="font-pretendard flex flex-col rounded-[10px] border border-[#d9d9d9] pt-6 shadow-md">
        <div className="relative self-center">
          <Image
            src={productInfo.thumbnailImageUrl}
            alt={`${productInfo.name} 이미지`}
            width={236}
            height={264}
            className="h-[264px] w-[236px] object-cover"
          />
          {isAuction && hasDiscount && (
            <div className="absolute right-6 -bottom-7 flex h-14 w-14 items-center justify-center rounded-full bg-transparent text-center text-[40px] font-bold text-red-500">
              {productInfo.discountRate}%
            </div>
          )}
          <WishlistButton
            productId={productInfo.id}
            initialIsLiked={productInfo.isLiked || false}
            className="absolute top-2 right-2"
          />
        </div>
        <div className="flex flex-col gap-2 px-4 py-2.5">
          <span className="font-bold">{productInfo.brandName}</span>
          <span className="truncate text-lg">{productInfo.name}</span>
          {priceDisplay}
          <div className="font-poppins flex gap-1 text-sm font-semibold text-gray-500">
            <img src={'/icons/star.svg'} width={20} height={20} alt="후기" />
            <span>{rating}</span>
            <span>({productInfo.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
