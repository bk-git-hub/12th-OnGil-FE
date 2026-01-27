interface ClearHistoryModalProps {
  onClose: () => void;
  onClear: () => void;
}

export default function ClearHistoryModal({
  onClose,
  onClear,
}: ClearHistoryModalProps) {
  return (
    <div className="font-pretendard animate-in fade-in zoom-in relative z-101 flex min-h-75 w-full min-w-85.5 transform flex-col rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200">
      <p className="flex h-full flex-1 items-center justify-center text-center text-2xl leading-relaxed font-medium text-black">
        최근 검색어를
        <br />
        모두 삭제할까요?
      </p>

      <div className="flex w-full gap-3 text-xl font-bold">
        <button
          type="button"
          onPointerDown={(e) => e.preventDefault()}
          onClick={onClose}
          className="flex-1 rounded-3xl bg-[#d1d1d1] px-4 py-4.5 text-black"
        >
          취소
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => {
            onClear();
            onClose();
          }}
          className="bg-ongil-teal flex-1 rounded-3xl px-4 py-4.5 text-white"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
