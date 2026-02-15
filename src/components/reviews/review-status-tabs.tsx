interface ReviewStatusTabsProps {
  writableCount: number;
  writtenCount: number;
}

export default function ReviewStatusTabs({
  writableCount,
  writtenCount,
}: ReviewStatusTabsProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d1d1d1] bg-[#efefef]">
      <div className="grid grid-cols-2">
        <button
          type="button"
          className="border-r border-[#d1d1d1] bg-white px-4 py-3 text-center text-base leading-tight font-semibold text-black"
          aria-pressed
        >
          쓸 수 있는 후기
          <br />({writableCount}개)
        </button>
        <button
          type="button"
          className="px-4 py-3 text-center text-base leading-tight font-medium text-[#9a9a9a]"
          aria-pressed={false}
          disabled
        >
          내가 쓴 후기
          <br />({writtenCount}개)
        </button>
      </div>
    </div>
  );
}
