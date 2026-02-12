import { api } from '@/lib/api-client';
import { Product } from '@/types/domain/product';
import { RecommendedProductCard } from './recommended-product-card';
import { RecommendCarouselItem } from './recommend-carousel-item';
import { RecommendCarousel } from './recommend-carousel';

export default async function RecommendProductContainer() {
  const products = await api.get<Product[]>('/products/recommend');
  return (
    <RecommendCarousel heading="추천 상품">
      {products.map((product) => (
        <RecommendCarouselItem key={product.id}>
          <RecommendedProductCard productInfo={product} />
        </RecommendCarouselItem>
      ))}
    </RecommendCarousel>
  );
}
