import {
  getCategories,
  getRecommendedSubCategories,
} from '@/app/actions/category';
import CategoryMainLayout from '@/components/category/category-main-layout';
import type { CategorySimple, SubCategory } from '@/types/domain/category';
import { auth } from '/auth';

function buildFallbackRecommendations(
  categories: Awaited<ReturnType<typeof getCategories>>,
): CategorySimple[] {
  const sortedSubs: SubCategory[] = categories
    .toSorted((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((category) =>
      category.subCategories.toSorted(
        (a, b) => a.displayOrder - b.displayOrder,
      ),
    );

  return sortedSubs.slice(0, 8).map((sub) => ({
    categoryId: sub.categoryId,
    name: sub.name,
    iconUrl: sub.iconUrl ?? undefined,
    displayOrder: sub.displayOrder,
  }));
}

export default async function CategoryPage() {
  const session = await auth();
  const userName = session?.user.nickName || '사용자';

  const [categories, recommendedSubCategories] = await Promise.all([
    getCategories(),
    getRecommendedSubCategories(),
  ]);

  const sortedCategories = categories.toSorted(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const parentLookup = sortedCategories.reduce<Record<number, number>>(
    (lookup, parent) => {
      parent.subCategories.forEach((sub) => {
        lookup[sub.categoryId] = parent.categoryId;
      });
      return lookup;
    },
    {},
  );

  const recommended =
    recommendedSubCategories.length > 0
      ? recommendedSubCategories
      : buildFallbackRecommendations(sortedCategories);

  return (
    <CategoryMainLayout
      categories={sortedCategories}
      recommended={recommended}
      parentLookup={parentLookup}
      userName={userName}
    />
  );
}
