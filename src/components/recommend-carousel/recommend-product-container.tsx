import { api } from '@/lib/api-client';
import { Product } from '@/types/domain/product';
import RecommendedProductCard from './recommended-product-card';
import { RecommendCarouselItem } from './recommend-carousel-item';
import { RecommendCarousel } from './recommend-carousel';
import { getMyWishlist } from '@/app/actions/wishlist';

interface RecommendProductContainerProps {
  endpoint: string;
  heading: string;
}

export default async function RecommendProductContainer({
  endpoint,
  heading,
}: RecommendProductContainerProps) {
  const [productsResult, wishlistResult] = await Promise.allSettled([
    api.get<Product[]>(endpoint),
    getMyWishlist(),
  ]);

  const products =
    productsResult.status === 'fulfilled' ? productsResult.value : [];
  const wishlistItems =
    wishlistResult.status === 'fulfilled' ? wishlistResult.value : [];

  const wishlistByProductId = new Map(
    wishlistItems.map((item) => [item.productId, item.wishlistId]),
  );

  return (
    <RecommendCarousel heading={heading}>
      {products.map((product) => (
        <RecommendCarouselItem key={product.id}>
          <RecommendedProductCard
            productInfo={{
              ...product,
              isLiked: wishlistByProductId.has(product.id),
              wishlistId: wishlistByProductId.get(product.id),
            }}
          />
        </RecommendCarouselItem>
      ))}
    </RecommendCarousel>
  );
}
