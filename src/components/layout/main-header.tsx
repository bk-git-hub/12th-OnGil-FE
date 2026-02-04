'use client';

import { useState } from 'react';
import SearchBar from '../search-bar/search-bar';
import { CartCountBadge } from '../cart/cart-count-badge';
import Link from 'next/link';

export default function MainHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="sticky top-0 z-100 flex w-full items-center justify-between bg-white p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <SearchBar onFocusChange={setIsSearchFocused} />
      <div
        className={`flex items-center overflow-hidden whitespace-nowrap ${
          isSearchFocused ? 'max-w-0 opacity-0' : 'ml-2 max-w-50 opacity-100'
        } `}
      >
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <button className="flex flex-col items-center px-1">
              <div className="relative">
                <img
                  src="/icons/cart.svg"
                  alt="장바구니"
                  width={30}
                  height={30}
                />
                <CartCountBadge className="absolute -top-1 -right-1 text-[10px]" />
              </div>
              <span className="font-pretendard text-[11px]">장바구니</span>
            </button>
          </Link>
          <button className="flex shrink-0 flex-col items-center px-1">
            <img src="/icons/notice.svg" alt="알림" width={30} height={30} />
            <span className="font-pretendard text-[11px]">알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}
