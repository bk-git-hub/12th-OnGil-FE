import { api } from '@/lib/api-client';
import { SubCategory } from '@/types/domain/category';
import SubCategorySlider from './sub-category-slider';

interface Props {
  params: Promise<{ parentId: string }>;
}

export default async function SubCategorySliderContainer({ params }: Props) {
  const { parentId } = await params;

  const subCategories = await api.get<SubCategory[]>(
    `/categories/${parentId}/sub-categories`,
  );

  const parentCategoryName = subCategories[0]?.parentCategoryName ?? '';

  return (
    <SubCategorySlider
      parentId={parentId}
      categories={subCategories}
      parentCategoryName={parentCategoryName}
    />
  );
}
