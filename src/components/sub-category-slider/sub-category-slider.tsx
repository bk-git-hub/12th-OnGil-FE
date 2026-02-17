'use client';

import { SubCategory } from '@/types/domain/category';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import SubCategoryDropdown from './sub-category-dropdown';

interface Props {
  categories: SubCategory[];
  parentId: string;
  parentCategoryName: string;
}

export default function SubCategorySlider({
  categories,
  parentId,
  parentCategoryName,
}: Props) {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);

  const lastScrollY = useRef(0);
  const isAnimating = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedSubCategory = categories.find(
    (cat) => cat.categoryId === Number(id),
  );

  useEffect(() => {
    const THRESHOLD = 15; // 감도 설정

    const handleScroll = () => {
      if (isAnimating.current) return;

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY < 10) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;
          setIsVisible(true);
          lockAnimation();
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(diff) < THRESHOLD) return;

      if (diff > 0 && isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
        lockAnimation();
      } else if (diff < 0 && !isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        lockAnimation();
      }

      if (isVisibleRef.current === diff < 0) {
        lastScrollY.current = currentScrollY;
      }
    };

    const lockAnimation = () => {
      isAnimating.current = true;
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        isAnimating.current = false;
        lastScrollY.current = window.scrollY;
      }, 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="sticky top-[85px] z-50 border-b bg-white shadow-sm transition-all duration-300">
      <div className="relative z-20 flex h-14 items-center justify-between bg-white px-4">
        {isVisible ? (
          <h2 className="text-xl font-bold text-gray-900">
            {parentCategoryName}
          </h2>
        ) : (
          <div className="animate-fadeIn flex items-center gap-2">
            <span className="text-lg font-bold text-gray-500">
              {parentCategoryName}
            </span>
            <span className="text-lg font-bold text-gray-300">:</span>
            <SubCategoryDropdown
              categories={categories}
              selectedCategory={selectedSubCategory}
              parentId={parentId}
            />
          </div>
        )}
      </div>

      <div
        className={`overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          isVisible ? 'max-h-50 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="pb-2">
          <ul className="no-scrollbar flex w-full gap-4 overflow-x-auto px-4 pb-2">
            {categories.map((cat) => {
              const isActive = cat.categoryId === Number(id);
              return (
                <li key={cat.categoryId} className="shrink-0">
                  <Link
                    href={`/category/${parentId}/${cat.categoryId}`}
                    replace
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`relative rounded-full p-0.5 ${
                        isActive ? 'ring-2 ring-black' : ''
                      }`}
                    >
                      <img
                        src={cat.iconUrl || '/icons/star.svg'}
                        alt={cat.name}
                        className="h-20 w-20 rounded-full bg-gray-100 object-cover"
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        isActive ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {cat.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
