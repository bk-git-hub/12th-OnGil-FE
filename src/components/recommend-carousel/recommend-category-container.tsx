import { api } from '@/lib/api-client';
import { Category } from '@/types/domain/category';
import { RecommendCarousel } from './recommend-carousel';
import { RecommendCarouselItem } from './recommend-carousel-item';
import { RecommendedCategoryCard } from './recommended-category-card';

export default async function RecommendCategoryContainer() {
  const categories = await api.get<Category[]>('/categories/recommended-sub');

  console.log(categories);

  return (
    <div className="w-full overflow-hidden">
      <h2>추천 카테고리</h2>
      <RecommendCarousel heading="추천 카테고리">
        {categories.map((category) => (
          <RecommendCarouselItem key={category.categoryId}>
            <RecommendedCategoryCard category={category} />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>
    </div>
  );
}
