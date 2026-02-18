import {
  getCategories,
  getRecommendedSubCategories,
} from '@/app/actions/category';
import { RecommendCarousel } from './recommend-carousel';
import { RecommendCarouselItem } from './recommend-carousel-item';
import RecommendedCategoryCard from './recommended-category-card';
import { auth } from '/auth';

export default async function RecommendCategoryContainer() {
  const session = await auth();
  if (!session) {
    return null;
  }
  const [recommendedSubResult, allCategoriesResult] = await Promise.allSettled([
    getRecommendedSubCategories(),
    getCategories(),
  ]);

  if (recommendedSubResult.status !== 'fulfilled') {
    return null;
  }

  const categories = recommendedSubResult.value;
  const allCategories =
    allCategoriesResult.status === 'fulfilled' ? allCategoriesResult.value : [];

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
      <RecommendCarousel heading="추천 카테고리" showDots={true}>
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
