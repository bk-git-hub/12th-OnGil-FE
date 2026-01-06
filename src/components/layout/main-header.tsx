import SearchBar from '../search-bar';

export default function MainHeader() {
  return (
    <div className="sticky top-0 z-100 flex w-full items-center justify-between gap-2.5 bg-white px-4 py-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
      <SearchBar />

      <div className="flex items-center gap-2">
        <button className="flex flex-col items-center">
          <img src="/icons/cart.svg" alt="장바구니" width={30} height={30} />
          <span className="font-pretendard text-[11px] break-keep">
            장바구니
          </span>
        </button>
        <button className="flex shrink-0 flex-col items-center">
          <img src="/icons/notice.svg" alt="알림" width={30} height={30} />
          <span className="font-pretendard text-[11px] break-keep">알림</span>
        </button>
      </div>
    </div>
  );
}
