import { Input } from '@/components/ui/input';

interface Props {
  userPoints: number;
  totalPrice: number;
  usedPoints: number;
  onPointsChange: (points: number) => void;
}

export default function PaymentInfoSection({
  userPoints,
  totalPrice,
  usedPoints,
  onPointsChange,
}: Props) {
  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value.replace(/[^0-9]/g, ''));
    if (val > userPoints) val = userPoints;
    if (val > totalPrice) val = totalPrice;
    onPointsChange(val);
  };

  return (
    <div className="flex flex-col p-5">
      <div className="mb-10 flex flex-col text-3xl leading-normal font-normal">
        <span>적립금/캐시는</span>
        <span>얼마나 사용하시겠습니까?</span>
      </div>

      {/* 적립금 섹션 */}
      <div className="mb-6">
        <div className="flex justify-around">
          <Input
            value={usedPoints || ''}
            onChange={handlePointChange}
            className="h-[87px] w-[239px] rounded-lg border border-black text-left text-3xl leading-normal font-medium placeholder:text-black"
            placeholder="0원"
            aria-label="적립금 사용 금액"
            inputMode="numeric"
          />
          <button
            onClick={() => onPointsChange(Math.min(userPoints, totalPrice))}
            className="h-[87px] rounded-lg border border-black text-left text-2xl leading-normal font-medium"
          >
            <div className="flex flex-col justify-center px-4 py-1">
              <span className="">모두</span>
              <span className="">사용</span>
            </div>
          </button>
        </div>
      </div>

      {/* 최종 금액 계산 */}
      <div className="flex gap-2 text-xl leading-normal font-medium">
        <span>현재 보유한 적립금: </span>
        <span>{userPoints.toLocaleString()}원</span>
      </div>
    </div>
  );
}
