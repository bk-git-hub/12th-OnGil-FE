import SearchBar from '@/components/search-bar';
import { CarouselWithDots } from '@/components/banner-carousel';
import {
  CategoryCarouselCard,
  RecommendCarousel,
  RecommendCarouselItem,
} from '@/components/recommend-carousel';
import { MAIN_CATEGORIES } from '@/mocks/categories';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-10">
      <SearchBar />

      <CarouselWithDots />
      <RecommendCarousel heading="추천 카테고리">
        {MAIN_CATEGORIES.map((category) => (
          <RecommendCarouselItem key={category.id}>
            <CategoryCarouselCard category={category} />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>
    </div>
  );
}
