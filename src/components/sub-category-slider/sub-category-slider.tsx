'use client';

import { SubCategory } from '@/types/domain/category';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  categories: SubCategory[];
  parentId: string;
}

export default function SubCategorySlider({ categories, parentId }: Props) {
  const { id } = useParams();

  return (
    <nav className="sticky top-0 z-10 border-b bg-white">
      <ul className="no-scrollbar flex w-full gap-3 overflow-x-auto p-4">
        {categories.map((cat) => {
          const isActive = cat.categoryId === Number(id);
          return (
            <li
              key={cat.categoryId}
              className={`w-fit shrink-0 rounded-full px-4 py-2`}
            >
              <Link
                href={`/category/${parentId}/${cat.categoryId}`}
                replace
                className="flex flex-col items-center text-[25px] font-bold"
              >
                <img
                  src={cat.iconUrl}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className={`rounded-full ${
                    isActive
                      ? 'border-ongil-teal border-[3px]'
                      : 'border-transparent border-[3px]'
                  }`}
                />
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
