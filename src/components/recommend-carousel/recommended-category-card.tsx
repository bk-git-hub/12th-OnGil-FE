import { Category } from '@/types/domain/category';
interface CategoryCarouselCardProps {
  category: Category;
}

export function RecommendedCategoryCard({
  category,
}: CategoryCarouselCardProps) {
  let categorySquare;
  if (category.iconUrl !== null) {
    categorySquare = (
      <img
        src={category.iconUrl}
        alt={category.name}
        width={200}
        height={200}
        className="rounded-[28px]"
      />
    );
  } else {
    categorySquare = (
      <div className="bg-ongil-teal flex aspect-square w-full items-center justify-center rounded-[28px]">
        <span className="text-2xl text-white">{category.name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {categorySquare}
      <span className="font-pretendard text-[32px] font-bold">
        {category.name}
      </span>
    </div>
  );
}
