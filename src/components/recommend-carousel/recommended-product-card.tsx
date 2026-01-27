import { Product } from '@/types/products';

export function RecommendedProductCard({
  productInfo,
}: {
  productInfo: Product;
}) {
  let priceDisplay;
  if (productInfo.discountPrice && productInfo.originalPrice) {
    priceDisplay = (
      <div className="text-ongil-teal flex gap-2 text-xl font-bold">
        <span>{productInfo.discountRate}%</span>
        <span>{productInfo.finalPrice.toLocaleString('ko-KR')}</span>{' '}
        <span className="font-normal text-black/50 line-through">
          {productInfo.originalPrice.toLocaleString('ko-KR')}
        </span>{' '}
      </div>
    );
  } else {
    priceDisplay = (
      <span className="text-ongil-teal text-xl font-bold">
        {productInfo.finalPrice.toLocaleString('ko-KR')}
      </span>
    );
  }

  return (
    <div className="font-pretendard flex flex-col rounded-[10px] border border-[#d9d9d9] pt-6 shadow-md">
      <img
        src={productInfo.thumbnailImageUrl}
        alt={`${productInfo.name} 이미지`}
        width={238}
        height={264}
      />
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
