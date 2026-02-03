import { Category, SubCategory } from '@/types/domain/category';
import SubCategoryItem from './subcategory-item';

// 카테고리별 섹션을 렌더링하고, 각 섹션 내부에 하위 카테고리 리스트를 그리드 형태로 보여주는 컴포넌트
export default function CategoryContentList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <>
      {categories.map((category) => (
        <section
          key={category.categoryId}
          id={category.categoryId.toString()}
          className="mb-8 scroll-mt-0"
        >
          <h2 className="sticky top-0 z-10 mb-3 border-b border-gray-100 bg-white py-3 text-sm font-bold text-gray-900">
            {category.name}
          </h2>
          <div className="grid grid-cols-3 gap-x-2 gap-y-4">
            {category.subCategories.map((sub: SubCategory) => (
              <SubCategoryItem
                key={sub.categoryId}
                label={sub.name}
                imageUrl={sub.iconUrl || '/icons/star.svg'}
                href={`/category/${category.categoryId}/${sub.categoryId}`}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
