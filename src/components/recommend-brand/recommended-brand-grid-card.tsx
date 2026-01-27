import { Product } from '@/types/products';

export default function RecommendedBrandGridCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="font-pretendard flex w-41 flex-col gap-1">
      <img
        src={product.thumbnailImageUrl}
        alt={product.name}
        width={164}
        height={170}
        className="h-[170px] w-[164px] object-cover"
      />
      <span className="font-extrabold">{product.brandName}</span>
      <span className="line-clamp-2 h-14 w-full overflow-hidden text-lg font-medium text-ellipsis">
        {product.name}
      </span>
      <div className="flex w-full gap-2 text-xl font-bold">
        {product.discountRate !== undefined && (
          <span className="text-ongil-teal">{product.discountRate}%</span>
        )}
        <span className="">{product.finalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
}
