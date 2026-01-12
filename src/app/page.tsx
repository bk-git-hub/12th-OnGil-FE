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
import NotificationManager from '@/components/pwa/notification-test';
import { MOCK_PRODUCTS } from '@/mocks/brands-and-products';

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <MainHeader />
      <NotificationManager />

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

      <MainNavBar />
    </div>
  );
}
