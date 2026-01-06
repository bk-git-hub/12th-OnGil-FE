'use client';

// 사용자 상호작용(클릭 이벤트)이 있는 클라이언트 컴포넌트로 분리함.

interface ProductActionsProps {
  // 필요한 경우 props 추가
}

export function ProductActions() {
  return (
    <div className="mt-8 flex gap-3">
      <button className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-4 font-bold hover:bg-gray-50">
        {/* 추후 장바구니 버튼 클릭했을 때 동작 할 함수를 넣을 수 있음. ex) onClick={() =>..... } */}
        장바구니
      </button>
      <button className="flex-1 cursor-pointer rounded-lg bg-black py-4 font-bold text-white hover:bg-gray-800">
        {/* 추후 구매하기 버튼 클릭했을 때 동작 할 함수를 넣을 수 있음. ex) onClick={() =>..... } */}
        구매하기
      </button>
    </div>
  );
}
