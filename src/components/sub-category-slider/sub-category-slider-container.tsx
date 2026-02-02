import { api } from '@/lib/api-client';
import { Category, SubCategory } from '@/types/domain/category';
import SubCategorySlider from './sub-category-slider';

const MOCK_SUB_CATEGORIES: SubCategory[] = [
  {
    categoryId: 101,
    name: '상의',
    displayOrder: 1,
    iconUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 102,
    name: '하의',
    displayOrder: 2,
    iconUrl:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 103,
    name: '아우터',
    displayOrder: 3,
    iconUrl:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 104,
    name: '신발',
    displayOrder: 4,
    iconUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 105,
    name: '가방',
    displayOrder: 5,
    iconUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 106,
    name: '모자',
    displayOrder: 6,
    iconUrl:
      'https://images.unsplash.com/photo-1533055640609-24b498dfd74c?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 107,
    name: '액세서리',
    displayOrder: 7,
    iconUrl:
      'https://images.unsplash.com/photo-1535633302704-c02fbcdb8c2a?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 108,
    name: '홈웨어',
    displayOrder: 8,
    iconUrl:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 109,
    name: '언더웨어',
    displayOrder: 9,
    iconUrl:
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=80&h=80',
  },
  {
    categoryId: 110,
    name: '스포츠',
    displayOrder: 10,
    iconUrl:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=80&h=80',
  },
];

const MOCK_PARENT_CATEGORY: Category = {
  categoryId: 1,
  name: '신발',
  displayOrder: 1,
  subCategories: MOCK_SUB_CATEGORIES,
};

interface Props {
  params: Promise<{ parentId: string }>;
}

export default async function SubCategorySliderContainer({ params }: Props) {
  const { parentId } = await params;
  let subCategories: SubCategory[];
  let parentCategory: Category;
  const pId = parentId ? parentId : '23';

  if (process.env.NODE_ENV !== 'production') {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    subCategories = MOCK_SUB_CATEGORIES;
    parentCategory = MOCK_PARENT_CATEGORY;
  } else {
    [subCategories, parentCategory] = await Promise.all([
      api.get<SubCategory[]>(`/categories/${parentId}/sub-categories`),
      api.get<Category>(`/categories/${parentId}`),
    ]);
  }

  return (
    <SubCategorySlider
      parentId={pId}
      categories={subCategories}
      parentCategoryName={parentCategory.name}
    />
  );
}
