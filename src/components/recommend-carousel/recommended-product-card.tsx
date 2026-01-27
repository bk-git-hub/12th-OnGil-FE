import { Product } from '@/types/products';
import { WishlistButton } from '../product/wishlist-button';

// For demonstration, let's assume the Product type can include isLiked
interface RecommendedProduct extends Product {
  isLiked?: boolean;
}

export function RecommendedProductCard({
  productInfo,
}: {
  productInfo: RecommendedProduct;
}) {
  const hasDiscount = productInfo.discountRate && productInfo.discountRate > 0;
  const isAuction = productInfo.productType === 'AUCTION';

  let priceDisplay;
  if (hasDiscount) {
    if (isAuction) {
      // For AUCTION, show final and original price. Discount is on the image.
      priceDisplay = (
        <div className="flex items-baseline gap-2">
          <span className="text-ongil-teal text-xl font-bold">
            {productInfo.finalPrice.toLocaleString('ko-KR')}
          </span>
          {productInfo.originalPrice && (
            <span className="font-normal text-black/50 line-through">
              {productInfo.originalPrice.toLocaleString('ko-KR')}
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
    <div className="font-pretendard flex flex-col rounded-[10px] border border-[#d9d9d9] pt-6 shadow-md">
      <div className="relative self-center">
        <img
          src={productInfo.thumbnailImageUrl}
          alt={`${productInfo.name} 이미지`}
          width={236}
          height={264}
          className="h-[264px] w-[236px] object-cover"
        />
        {isAuction && hasDiscount && (
          <div className="absolute right-2 bottom-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/90 text-center text-lg font-bold text-white">
            {productInfo.discountRate}%
          </div>
        )}
        <WishlistButton
          productId={productInfo.id}
          initialIsLiked={productInfo.isLiked}
          className="absolute top-2 right-2"
        />
      </div>
      <div className="flex flex-col gap-2 px-4 py-2.5">
        <span className="font-bold">{productInfo.brandName}</span>
        <span className="truncate text-lg">{productInfo.name}</span>
        {priceDisplay}
        <div className="font-poppins flex gap-1 text-sm font-semibold text-gray-500">
          <img src={'/icons/star.svg'} width={20} height={20} alt="후기" />
          <span>4.5</span>
          <span>({productInfo.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}
