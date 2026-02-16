import { api } from '@/lib/api-client';
import { Product } from '@/types/domain/product';
import RecommendedProductCard from './recommended-product-card';
import { RecommendCarouselItem } from './recommend-carousel-item';
import { RecommendCarousel } from './recommend-carousel';

interface RecommendProductContainerProps {
  endpoint: string;
  heading: string;
}

export default async function RecommendProductContainer({
  endpoint,
  heading,
}: RecommendProductContainerProps) {
  const products = await api.get<Product[]>(endpoint);
  return (
    <RecommendCarousel heading={heading}>
      {products.map((product) => (
        <RecommendCarouselItem key={product.id}>
          <RecommendedProductCard productInfo={product} />
        </RecommendCarouselItem>
      ))}
    </RecommendCarousel>
  );
}
