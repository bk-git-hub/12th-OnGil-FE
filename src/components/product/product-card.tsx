import Link from 'next/link';
import { Product } from '@/types/domain/product';

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트, 클릭 시 상세 페이지로 이동
 * @param {ProductCardProps} props - 컴포넌트 props
 * @param {Product} props.product - 상품 정보
 * @returns {JSX.Element} 상품 카드 컴포넌트
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="block">
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
          {product.discountRate > 0 && (
            <span className="text-ongil-teal">{product.discountRate}%</span>
          )}
          <span>{product.finalPrice.toLocaleString()}</span>
        </div>

        <span className="text-xs text-gray-500">
          후기 {product.reviewCount.toLocaleString()}개
        </span>
      </div>
    </Link>
  );
}
