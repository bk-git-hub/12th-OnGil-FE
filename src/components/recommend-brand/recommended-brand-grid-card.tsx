import { Product } from '@/types/products';

export default function RecommendedBrandGridCard({
  product,
}: {
  product: Product;
}) {
  return (
    <div className="flex flex-col gap-1">
      <img
        src={product.thumbnailImageUrl}
        alt={product.name}
        width={164}
        height={170}
      />
      <span className="text-sm font-extrabold">{product.brandName}</span>
      <span className="truncate">{product.name}</span>
      <div className="flex w-full gap-2">
        {product.discountRate !== undefined && (
          <span className="text-ongil-teal">{product.discountRate}%</span>
        )}
        <span className="">{product.finalPrice.toLocaleString()}</span>
      </div>
    </div>
  );
}
