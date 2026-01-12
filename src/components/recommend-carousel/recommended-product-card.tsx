import { Product } from '@/types/products';

export function RecommendedProductCard({
  productInfo,
}: {
  productInfo: Product;
}) {
  let priceDisplay;
  if (productInfo.isOnSale) {
    priceDisplay = (
      <div className="flex gap-2">
        <span>{productInfo.price}</span>{' '}
        <span className="line-through">{productInfo.originalPrice}</span>{' '}
      </div>
    );
  } else {
    priceDisplay = <span>{productInfo.price}</span>;
  }

  return (
    <div className="flex flex-col rounded-[10px] border border-[#d9d9d9] pt-6 shadow-md">
      <img
        src={productInfo.imageUrl}
        alt={`${productInfo.productName} 이미지`}
        width={238}
        height={264}
      />
      <div className="flex flex-col gap-2 px-4">
        <span>{productInfo.brand}</span>
        <span className="truncate">{productInfo.productName}</span>
        {priceDisplay}
      </div>
    </div>
  );
}
