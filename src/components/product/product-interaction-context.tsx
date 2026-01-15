'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ProductContextType {
  shouldScrollToTab: boolean; // 스크롤 이동 여부
  triggerScroll: () => void; // 탭 클릭 시 스크롤 트리거
  resetScroll: () => void; // 스크롤 상태 초기화
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductInteractionProvider({
  children,
}: {
  children: ReactNode;
}) {
  // 탭으로 스크롤 이동이 필요한지 여부 상태 관리
  const [shouldScrollToTab, setShouldScrollToTab] = useState(false);

  // 탭 클릭 시 스크롤 이동 트리거 함수
  const triggerScroll = () => setShouldScrollToTab(true);
  // 스크롤 상태 초기화 함수
  const resetScroll = () => setShouldScrollToTab(false);

  return (
    // 컨텍스트 프로바이더로 상태와 함수를 하위 컴포넌트에 제공
    <ProductContext.Provider
      value={{ shouldScrollToTab, triggerScroll, resetScroll }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// 하위 컴포넌트에서 컨텍스트 데이터 사용을 위한 커스텀 훅
export function useProductInteraction() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'useProductInteraction must be used within a ProductInteractionProvider',
    );
  }
  return context;
}
