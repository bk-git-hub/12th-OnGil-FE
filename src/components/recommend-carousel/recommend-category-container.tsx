import { api } from '@/lib/api-client';
import { Category, SubCategory } from '@/types/domain/category';
import { RecommendCarousel } from './recommend-carousel';
import { RecommendCarouselItem } from './recommend-carousel-item';
import { RecommendedCategoryCard } from './recommended-category-card';
import { auth } from '/auth';

export default async function RecommendCategoryContainer() {
  const session = await auth();
  if (!session) {
    return null;
  }
  const [categories, allCategories] = await Promise.all([
    api.get<SubCategory[]>('/categories/recommended-sub'),
    api.get<Category[]>('/categories'),
  ]);

  const parentCategoryLookup = allCategories.reduce<Record<number, number>>(
    (lookup, parent) => {
      parent.subCategories.forEach((sub) => {
        lookup[sub.categoryId] = parent.categoryId;
      });
      return lookup;
    },
    {},
  );

  return (
    <div className="w-full overflow-hidden">
      <h2>추천 카테고리</h2>
      <RecommendCarousel heading="추천 카테고리">
        {categories.map((category) => (
          <RecommendCarouselItem key={category.categoryId}>
            <RecommendedCategoryCard
              category={category}
              parentCategoryId={
                parentCategoryLookup[category.categoryId] ?? null
              }
            />
          </RecommendCarouselItem>
        ))}
      </RecommendCarousel>
    </div>
  );
}
