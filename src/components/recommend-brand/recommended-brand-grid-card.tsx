import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/domain/product';

export default function RecommendedBrandGridCard({
  product,
}: {
  product: Product;
}) {
  const href = `/product/${product.id}?from=${encodeURIComponent('/')}`;

  return (
    <Link href={href} className="block">
      <div className="font-pretendard flex w-41 flex-col gap-1">
        <Image
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
          {product.discountRate > 0 && (
            <span className="text-ongil-teal">{product.discountRate}%</span>
          )}
          <span>{product.finalPrice.toLocaleString('ko-KR')}</span>
        </div>
      </div>
    </Link>
  );
}
