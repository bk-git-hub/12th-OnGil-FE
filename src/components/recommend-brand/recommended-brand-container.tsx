import { api } from '@/lib/api-client';
import { BrandWithProducts } from '@/types/domain/brand';
import RecommendedBrandClient from './recommended-brand-client';
import { getMyWishlist } from '@/app/actions/wishlist';

export default async function RecommendedBrandContainer() {
  const [brandsResult, wishlistResult] = await Promise.allSettled([
    api.get<BrandWithProducts[]>('/brands/recommend', {
      cache: 'force-cache',
      next: { revalidate: 60 },
    }),
    getMyWishlist(),
  ]);

  const brands = brandsResult.status === 'fulfilled' ? brandsResult.value : [];
  const wishlistItems =
    wishlistResult.status === 'fulfilled' ? wishlistResult.value : [];

  const wishlistByProductId = new Map(
    wishlistItems.map((item) => [item.productId, item.wishlistId]),
  );

  const brandsWithWishlist = brands.map((brand) => ({
    ...brand,
    products: brand.products.map((product) => ({
      ...product,
      isLiked: wishlistByProductId.has(product.id),
      wishlistId: wishlistByProductId.get(product.id),
    })),
  }));

  return <RecommendedBrandClient brands={brandsWithWishlist} />;
}
