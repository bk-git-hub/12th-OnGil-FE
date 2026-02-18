import { getCategories } from '@/app/actions/category';
import CategoryContentList from '@/components/category/category-content-list';
import CategoryLayout from '@/components/category/category-layout';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ parentId: string }>;
}

export default async function CategoryParentPage({ params }: PageProps) {
  const { parentId } = await params;
  const categories = await getCategories();
  const sortedCategories = categories.toSorted(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  if (sortedCategories.length === 0) {
    redirect('/category');
  }

  const parsedParentId = Number(parentId);
  const hasMatchedParent = sortedCategories.some(
    (category) => category.categoryId === parsedParentId,
  );

  if (!Number.isFinite(parsedParentId) || !hasMatchedParent) {
    redirect(`/category/${sortedCategories[0].categoryId}`);
  }

  return (
    <CategoryLayout
      categories={sortedCategories}
      initialCategoryId={parsedParentId}
    >
      <CategoryContentList categories={sortedCategories} />
    </CategoryLayout>
  );
}
