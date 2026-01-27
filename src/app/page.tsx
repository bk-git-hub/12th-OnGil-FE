import { CarouselWithDots } from '@/components/banner-carousel';
import {
  RecommendedCategoryCard,
  RecommendCarousel,
  RecommendCarouselItem,
  RecommendedProductCard,
} from '@/components/recommend-carousel';
import { MAIN_CATEGORIES } from '@/mocks/categories';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';

import { BRANDS, MOCK_PRODUCTS } from '@/mocks/brands-and-products';
import RecommendedBrandContainer from '@/components/recommend-brand/recommended-brand-container';

export default async function Home() {
  const p1 = MOCK_PRODUCTS.slice(0, 6);
  const p2 = MOCK_PRODUCTS.slice(6, 12);
  const p3 = MOCK_PRODUCTS.slice(12, 18);

  return (
    <div className="flex flex-col items-center">
      <MainHeader />

      <CarouselWithDots />
      <RecommendCarousel heading="추천 카테고리">
        {MAIN_CATEGORIES.map((category) => (
          <RecommendCarouselItem key={category.id}>
            <RecommendedCategoryCard category={category} />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>

      <RecommendCarousel heading="추천 상품">
        {MOCK_PRODUCTS.map((product) => (
          <RecommendCarouselItem key={product.id}>
            <RecommendedProductCard productInfo={product} />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>

      <RecommendedBrandContainer brands={BRANDS} productLists={[p1, p2, p3]} />

      <MainNavBar />
    </div>
  );
}
