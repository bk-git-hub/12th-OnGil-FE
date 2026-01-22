interface ClearHistoryModalProps {
  onClose: () => void;
  onClear: () => void;
}

export default function ClearHistoryModal({
  onClose,
  onClear,
}: ClearHistoryModalProps) {
  return (
    <div className="animate-in fade-in zoom-in relative z-101 w-full max-w-[320px] transform rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200">
      <div className="flex flex-col items-center text-center">
        <p className="mb-6 text-sm leading-relaxed font-normal text-gray-500">
          모든 최근 검색 기록이 삭제됩니다.
          <br />
          정말 진행하시겠습니까?
        </p>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onPointerDown={(e) => e.preventDefault()}
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
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
            className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-colors hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
