'use client';

import { SubCategory } from '@/types/domain/category';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  categories: SubCategory[];
  selectedCategory?: SubCategory;
  parentId: string;
}

export default function SubCategoryDropdown({
  categories,
  selectedCategory,
  parentId,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedCategory) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-lg font-bold text-black transition-opacity hover:opacity-70"
      >
        {selectedCategory.name}
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-50 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-xl duration-100">
          <ul className="max-h-75 overflow-y-auto">
            {categories.map((cat) => {
              const isSelected = cat.categoryId === selectedCategory.categoryId;
              return (
                <li key={cat.categoryId}>
                  <Link
                    href={`/category/${parentId}/${cat.categoryId}`}
                    replace
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isSelected
                        ? 'bg-black font-medium text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
