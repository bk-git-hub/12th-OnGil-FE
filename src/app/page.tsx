import { CarouselWithDots } from '@/components/banner-carousel';
import {
  CategoryCarouselCard,
  RecommendCarousel,
  RecommendCarouselItem,
} from '@/components/recommend-carousel';
import { MAIN_CATEGORIES } from '@/mocks/categories';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';

export default async function Home() {
  return (
    <div className="flex flex-col items-center">
      <MainHeader />

      <CarouselWithDots />
      <RecommendCarousel heading="추천 카테고리">
        {MAIN_CATEGORIES.map((category) => (
          <RecommendCarouselItem key={category.id}>
            <CategoryCarouselCard category={category} />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>

      <MainNavBar />
    </div>
  );
}
