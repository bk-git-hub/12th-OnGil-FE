import Image from 'next/image';

export interface PaymentDisplayItem {
  productId: number;
  productName: string;
  brandName: string;
  thumbnailImageUrl: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  originalPrice: number; // 정가
  price: number; // 최종가(판매가)
  totalPrice: number;
  cartItemId?: number;
}

interface Props {
  items: PaymentDisplayItem[];
}

export default function OrderItemsSection({ items }: Props) {
  const originalTotal = items.reduce(
    (acc, item) => acc + item.originalPrice * item.quantity,
    0,
  );
  const discountTotal = items.reduce(
    (acc, item) => acc + (item.originalPrice - item.price) * item.quantity,
    0,
  );
  const finalTotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const hasDiscount = discountTotal > 0;

  return (
    <div className="mt-8 flex flex-col gap-6 px-5">
      <p className="text-center text-3xl leading-normal font-medium">
        주문 정보 확인해주세요
      </p>
      <ul className="mt-10 space-y-4">
        {items.map((item, index) => (
          <li key={`${item.productId}-${index}`} className="flex gap-4">
            <div className="flex h-full w-full items-center justify-center gap-4 rounded-2xl border border-black p-5">
              {item.thumbnailImageUrl ? (
                <Image
                  src={item.thumbnailImageUrl}
                  alt={item.productName}
                  width={110}
                  height={110}
                />
              ) : (
                <div className="flex h-[110px] w-[110px] items-center justify-center text-xl">
                  No Image
                </div>
              )}
              <div className="flex flex-col justify-center gap-7 text-xl leading-[18px] font-medium">
                <span>{item.brandName}</span>
                <p>{item.productName}</p>
                <span>
                  {item.selectedColor} / {item.selectedSize}
                </span>
                <span>{item.quantity}개</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasDiscount && (
        <p className="text-red text-center text-xl leading-normal font-medium">
          최대 할인이 적용 됐어요
        </p>
      )}

      <div className="mt-16 flex flex-col justify-center gap-6 text-xl leading-normal font-medium">
        <div className="flex items-center justify-between">
          <span>상품 금액</span>
          <span className="text-2xl leading-[18px]">
            {originalTotal.toLocaleString()}원
          </span>
        </div>
        {hasDiscount && (
          <div className="flex items-center justify-between">
            <span>할인 금액</span>
            <span className="text-2xl leading-[18px]">
              {discountTotal.toLocaleString()}원
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>총 금액</span>
          <span className="text-3xl leading-[18px]">
            {finalTotal.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
