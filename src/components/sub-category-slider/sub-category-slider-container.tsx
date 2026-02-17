import { getSubCategories } from '@/app/actions/category';
import SubCategorySlider from './sub-category-slider';

interface Props {
  params: Promise<{ parentId: string }>;
}

export default async function SubCategorySliderContainer({ params }: Props) {
  const { parentId } = await params;
  const parsedParentId = Number(parentId);

  const subCategories = Number.isFinite(parsedParentId)
    ? await getSubCategories(parsedParentId)
    : [];

  const parentCategoryName = subCategories[0]?.parentCategoryName ?? '';

  return (
    <SubCategorySlider
      parentId={parentId}
      categories={subCategories}
      parentCategoryName={parentCategoryName}
    />
  );
}
