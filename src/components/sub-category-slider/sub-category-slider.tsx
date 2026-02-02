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

  const lastScrollY = useRef(0);
  const isAnimating = useRef(false); // [핵심 1] 애니메이션 중인지 확인하는 락(Lock)

  const selectedSubCategory = categories.find(
    (cat) => cat.categoryId === Number(id),
  );

  useEffect(() => {
    const THRESHOLD = 15; // 감도 설정

    const handleScroll = () => {
      // 내가 높이를 바꾸는 중(애니메이션 중)이면 스크롤 이벤트 무시
      if (isAnimating.current) return;

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      // 1. 최상단 안전장치 (맨 위면 무조건 펼침)
      if (currentScrollY < 10) {
        if (!isVisible) {
          setIsVisible(true);
          // 펼칠 때도 높이가 변하므로 잠금
          lockAnimation();
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      // 의미 없는 미세 움직임 무시
      if (Math.abs(diff) < THRESHOLD) return;

      if (diff > 0 && isVisible) {
        // ⬇️ 내리는 중 -> 접기
        setIsVisible(false);
        lastScrollY.current = currentScrollY;
        lockAnimation(); // 높이가 줄어들면서 생기는 스크롤 이벤트 무시 시작
      } else if (diff < 0 && !isVisible) {
        // ⬆️ 올리는 중 -> 펼치기
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        lockAnimation(); // 높이가 늘어나면서 생기는 스크롤 이벤트 무시 시작
      }

      // 상태 변화가 없을 때는 그냥 현재 위치만 갱신
      if (isVisible === diff < 0) {
        // (내리는데 접혀있거나) or (올리는데 펴져있으면)
        lastScrollY.current = currentScrollY;
      }
    };

    // [핵심 3] 락을 거는 함수 (CSS duration인 300ms 동안 얼음)
    const lockAnimation = () => {
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
        // 애니메이션 끝나고 락 풀릴 때 스크롤 위치 재조정 (튀는 거 방지)
        lastScrollY.current = window.scrollY;
      }, 350); // CSS transition duration(300ms)보다 살짝 길게 잡음
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]); // isVisible 의존성 추가

  return (
    <div className="sticky top-14 z-50 border-b bg-white shadow-sm transition-all duration-300">
      {/* 1. 상단 헤더 바 (높이 고정) */}
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

      {/* 2. 슬라이더 영역 (높이를 직접 조절하여 Layout Shift 발생 시킴) */}
      {/* max-height로 애니메이션을 줍니다. height: auto는 애니메이션이 안 먹힘 */}
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
                        src={cat.iconUrl}
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
