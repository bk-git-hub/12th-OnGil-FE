import { Product } from '@/types/products';

export function RecommendedProductCard({
  productInfo,
}: {
  productInfo: Product;
}) {
  let priceDisplay;
  if (productInfo.discountPrice !== undefined) {
    priceDisplay = (
      <div className="flex gap-2">
        <span>{productInfo.finalPrice}</span>{' '}
        <span className="line-through">{productInfo.originalPrice}</span>{' '}
      </div>
    );
  } else {
    priceDisplay = <span>{productInfo.finalPrice}</span>;
  }

  return (
    <div className="flex flex-col rounded-[10px] border border-[#d9d9d9] pt-6 shadow-md">
      <img
        src={productInfo.thumbnailImageUrl}
        alt={`${productInfo.name} 이미지`}
        width={238}
        height={264}
      />
      <div className="flex flex-col gap-2 px-4">
        <span>{productInfo.brandName}</span>
        <span className="truncate">{productInfo.name}</span>
        {priceDisplay}
      </div>
    </div>
  );
}
