import Link from 'next/link';
import Image from 'next/image';
import { CategorySimple } from '@/types/domain/category';

interface CategoryCarouselCardProps {
  category: CategorySimple;
  parentCategoryId: number | null;
}

export default function RecommendedCategoryCard({
  category,
  parentCategoryId,
}: CategoryCarouselCardProps) {
  const href = parentCategoryId
    ? `/category/${parentCategoryId}/${category.categoryId}`
    : '/category';

  let categorySquare;
  if (category.iconUrl) {
    categorySquare = (
      <Image
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
    <Link href={href} className="flex flex-col items-center">
      {categorySquare}
      <span className="font-pretendard text-[32px] font-bold">
        {category.name}
      </span>
    </Link>
  );
}
