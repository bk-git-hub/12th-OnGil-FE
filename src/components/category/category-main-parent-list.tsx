import type { Category } from '@/types/domain/category';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryMainParentListProps {
  categories: Category[];
}

export default function CategoryMainParentList({
  categories,
}: CategoryMainParentListProps) {
  return (
    <ul className="mt-12 bg-white">
      {categories.map((category) => (
        <li
          key={category.categoryId}
          className="border-b border-black last:border-b-0"
        >
          <Link
            href={`/category/${category.categoryId}`}
            className="flex items-center justify-between p-6"
          >
            <span className="text-2xl leading-6 font-bold -tracking-[0.408px] text-black">
              {category.name}
            </span>
            <ChevronRight size={44} className="text-black" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
